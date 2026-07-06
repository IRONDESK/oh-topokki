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

const SNAP_DISTANCE = 90; // px, full 토글/닫기 스냅 기준
const FLICK_VELOCITY = 0.5; // px/ms, 거리가 짧아도 스냅시키는 플릭 속도 기준
const STICKY_OFFSET = 80; // px, 이만큼 스크롤을 내려야 isSticky 활성화

export default function ScrolledBottomSheet(props: BottomSheetProps) {
  const { controller, children } = props;
  const isDesktop = useIsDesktop();
  const overlays = useOverlayData();
  const hasOverlays = Object.keys(overlays).length > 0;

  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [isSticky, setIsSticky] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // 드래그 값은 렌더에 영향 주지 않으므로 ref로 관리한다.
  // (touchmove마다 setState 하면 초당 ~60회 전체 리렌더 → 자식까지 재실행되어 끊김)
  const drag = useRef({
    active: false,
    startY: 0,
    lastY: 0,
    lastT: 0,
    velocity: 0,
    offset: 0,
  });

  const onClose = () => {
    controller.close();
    setTimeout(controller.unmount, 300);
  };

  const resetDragStyle = () => {
    // 인라인 transform/transition 제거 → className 트랜지션이 다시 동작
    const el = sectionRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "";
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const inner = innerRef.current;
    // full 상태에서 내용이 스크롤돼 있으면 시트 드래그가 아니라 내부 스크롤로 본다.
    const isScrolled = isFull && !!inner && inner.scrollTop > 1;

    drag.current = {
      active: !isScrolled,
      startY: touch.clientY,
      lastY: touch.clientY,
      lastT: performance.now(),
      velocity: 0,
      offset: 0,
    };
    if (!isScrolled && sectionRef.current) {
      sectionRef.current.style.transition = "none";
    }
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const d = drag.current;
    const el = sectionRef.current;
    const inner = innerRef.current;
    if (!el) return;

    const y = event.touches[0].clientY;
    const now = performance.now();
    if (now > d.lastT) d.velocity = (y - d.lastY) / (now - d.lastT);
    d.lastY = y;
    d.lastT = now;

    // full 상태에서 위로 스와이프해 내부 스크롤이 시작되면 드래그를 스크롤에 넘긴다.
    if (d.active && isFull && inner && inner.scrollTop > 1) {
      d.active = false;
      resetDragStyle();
      return;
    }

    if (!d.active) {
      // 내부 스크롤로 최상단에 닿은 뒤 같은 제스처로 계속 내리면
      // 그 지점부터 시트 드래그로 이어받는다. (full → 바텀시트 자연 전환)
      const atTop = !inner || inner.scrollTop <= 1;
      if (!(isFull && atTop && d.velocity > 0)) return;
      d.active = true;
      d.startY = y;
      el.style.transition = "none";
    }

    d.offset = y - d.startY;
    const translateY = isFull
      ? `${Math.max(d.offset, 0)}px`
      : `max(calc(35vh + ${d.offset}px), 1vh)`;
    // 리렌더 없이 DOM에 직접 반영
    el.style.transform = `translate3d(-50%, ${translateY}, 0)`;
  };

  const onTouchEnd = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    resetDragStyle();

    const movedDown =
      d.offset >= SNAP_DISTANCE ||
      (d.velocity > FLICK_VELOCITY && d.offset > 0);
    const movedUp =
      d.offset <= -SNAP_DISTANCE ||
      (d.velocity < -FLICK_VELOCITY && d.offset < 0);

    if (isFull) {
      if (!movedDown) return;
      // 시트 위치(35vh)를 지나서까지 끌어내렸으면 한 번에 닫는다.
      if (d.offset > window.innerHeight * 0.35 + SNAP_DISTANCE) onClose();
      else setIsFull(false);
    } else if (movedUp) {
      setIsFull(true);
    } else if (movedDown) {
      onClose();
    }
  };

  const onTouchCancel = () => {
    drag.current.active = false;
    resetDragStyle();
  };

  // overlay가 떠 있는 동안 body 스크롤 잠금
  useEffect(() => {
    if (!hasOverlays) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [hasOverlays]);

  // sticky 감지: 스크롤 컨테이너(데스크톱=section, 모바일=inner)가
  // STICKY_OFFSET 이상 내려갔을 때 활성화. full 해제 시 재계산을 위해 isFull에도 의존.
  useEffect(() => {
    const scroller = isDesktop ? sectionRef.current : innerRef.current;
    if (!scroller) return;

    const onScroll = () => setIsSticky(scroller.scrollTop > STICKY_OFFSET);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [isDesktop, isFull]);

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-2000" />
      <section
        ref={sectionRef}
        data-open={controller.isOpen}
        data-desktop={isDesktop}
        data-full={isFull}
        onTouchStart={isDesktop ? undefined : onTouchStart}
        onTouchMove={isDesktop ? undefined : onTouchMove}
        onTouchEnd={isDesktop ? undefined : onTouchEnd}
        onTouchCancel={isDesktop ? undefined : onTouchCancel}
        className={[
          "fixed left-1/2 top-0 bg-white rounded-t-card border-t-[1.5px] border-x-[1.5px] border-gray-200 pb-8 min-h-screen w-full max-w-130",
          "transform-[translate3d(-50%,98vh,0)] [transition:transform_0.25s,opacity_0.3s,border-radius_0.3s]",
          "text-gray-700 opacity-0 z-2005 overscroll-contain will-change-transform",
          "data-[open=true]:transform-[translate3d(-50%,35vh,0)] data-[open=true]:opacity-100 data-[open=true]:shadow-md",
          // full transform은 open과 조합해야 닫힐 때(open=false) 슬라이드-다운 애니메이션이 살아난다.
          "data-[open=true]:data-[full=true]:transform-[translate3d(-50%,0,0)]",
          "data-[full=true]:pt-[env(safe-area-inset-top,4px)] data-[full=true]:rounded-none",
          "data-[desktop=true]:overflow-y-auto data-[desktop=true]:max-h-[70vh] data-[desktop=true]:min-h-[70vh]",
        ].join(" ")}
      >
        <div
          ref={innerRef}
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
            overflowY: isFull ? "auto" : "visible",
            height: isFull ? "99.9dvh" : "auto",
            overscrollBehaviorY: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isDesktop ? (
            <div className="py-3 pl-4 pr-3 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <Icons name="cross" w="bold" size={20} t="round" />
              </button>
            </div>
          ) : (
            <div className="w-[15%] h-1 rounded-chip bg-gray-300 mt-4.5 mb-3 mx-auto" />
          )}
          {children({ isFull, isSticky })}
        </div>
      </section>
    </>
  );
}
