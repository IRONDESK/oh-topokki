import React, { useEffect, useRef, useState } from "react";
import { useOverlayData } from "overlay-kit";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import Icons from "./Icons";

type BottomSheetProps = {
  controller: {
    close: () => void;
    isOpen: boolean;
    unmount: () => void;
  };
  children: ({
    isFull,
    isSticky,
  }: {
    isFull: boolean;
    isSticky: boolean;
  }) => React.ReactNode;
};

const SNAP_THRESHOLD = 90; // px, full 토글/닫기 스냅 기준

export default function ScrolledBottomSheet(props: BottomSheetProps) {
  const { controller, children } = props;
  const isDesktop = useIsDesktop();
  const overlays = useOverlayData();
  const hasOverlays = Object.keys(overlays).length > 0;

  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [isSticky, setIsSticky] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // 드래그 값은 렌더에 영향 주지 않으므로 ref로 관리한다.
  // (touchmove마다 setState 하면 초당 ~60회 전체 리렌더 → 자식까지 재실행되어 끊김)
  const drag = useRef({ active: false, startY: 0, offset: 0 });

  const onClose = () => {
    if (isDesktop && isFull) {
      controller.unmount();
      return;
    }
    controller.close();
    setTimeout(controller.unmount, 300);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const scrollContainer = innerRef.current;
    if (scrollContainer) {
      const hasScroll =
        scrollContainer.scrollHeight > scrollContainer.clientHeight;
      const isScrolled = scrollContainer.scrollTop > 5;
      // 내용이 스크롤된 상태면 시트 드래그가 아니라 내부 스크롤로 본다.
      if (hasScroll && isScrolled) return;
    }

    drag.current = {
      active: true,
      startY: event.touches[0].clientY,
      offset: 0,
    };
    if (sectionRef.current) sectionRef.current.style.transition = "none";
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const d = drag.current;
    const el = sectionRef.current;
    if (!d.active || !el) return;

    d.offset = event.touches[0].clientY - d.startY;
    const y = isFull
      ? `${Math.max(d.offset, 0)}px`
      : `max(calc(35vh + ${d.offset}px), 1vh)`;
    // 리렌더 없이 DOM에 직접 반영
    el.style.transform = `translate3d(-50%, ${y}, 0)`;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const d = drag.current;
    if (!d.active) return;
    if (d.offset < 0 && isFull) return; // full 상태에서 위로 드래그는 무시
    d.active = false;

    // 인라인 transform/transition 제거 → className 트랜지션이 다시 동작
    const el = sectionRef.current;
    if (el) {
      el.style.transform = "";
      el.style.transition = "";
    }

    const distance = d.startY - event.changedTouches[0].clientY;
    if (distance >= SNAP_THRESHOLD) {
      setIsFull(true);
    } else if (distance <= -SNAP_THRESHOLD) {
      if (isFull) setIsFull(false);
      else onClose();
    }
  };

  // overlay가 떠 있는 동안 body 스크롤 잠금
  useEffect(() => {
    if (!hasOverlays) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [hasOverlays]);

  // sticky 감지. desktop/mobile 전환 시 barRef 엘리먼트가 교체되므로 isDesktop에 의존.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: [1] },
    );
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[2000]" />
      <section
        ref={sectionRef}
        data-open={controller.isOpen}
        data-desktop={isDesktop}
        data-full={isFull}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={[
          "fixed left-1/2 top-0 bg-white rounded-t-card border-t-[1.5px] border-x-[1.5px] border-gray-200 pb-8 min-h-screen w-full max-w-[520px]",
          "[transform:translate3d(-50%,98vh,0)] [transition:transform_0.25s,opacity_0.3s,border-radius_0.3s]",
          "text-gray-700 opacity-0 z-[2005] overscroll-contain will-change-transform",
          "data-[open=true]:[transform:translate3d(-50%,35vh,0)] data-[open=true]:opacity-100 data-[open=true]:shadow-md",
          "data-[full=true]:[transform:translate3d(-50%,0,0)] data-[full=true]:pt-[env(safe-area-inset-top,4px)] data-[full=true]:rounded-none data-[full=true]:opacity-100",
          "data-[desktop=true]:overflow-y-auto data-[desktop=true]:max-h-[70vh] data-[desktop=true]:min-h-[70vh]",
        ].join(" ")}
      >
        <div
          ref={innerRef}
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
            overflowY: isFull ? "auto" : "visible",
            height: isFull ? "99.9dvh" : "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isDesktop ? (
            <div ref={barRef} className="py-3 pl-4 pr-3 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <Icons name="cross" w="bold" size={20} t="round" />
              </button>
            </div>
          ) : (
            <div
              ref={barRef}
              className="w-[15%] h-1 rounded-chip bg-gray-300 mt-[18px] mb-3 mx-auto"
            />
          )}
          {children({ isFull, isSticky })}
        </div>
      </section>
    </>
  );
}
