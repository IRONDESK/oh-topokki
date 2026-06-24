import React, { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import Icons from "./Icons";
import { useOverlayData } from "overlay-kit";

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
  dragMultiplier?: number;
};

export default function ScrolledBottomSheet(props: BottomSheetProps) {
  const { controller, children, dragMultiplier = 0.15 } = props;
  const isDesktop = useIsDesktop();
  const overlays = useOverlayData();
  const hasOverlays = Object.values(overlays).length > 0;
  const innerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [isSticky, setIsSticky] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

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
      const isScrolled = scrollContainer.scrollTop > 5;
      const hasScroll =
        scrollContainer.scrollHeight > scrollContainer.clientHeight;

      if (hasScroll && isScrolled) {
        return;
      }
    }

    setStartPos(event.touches[0].clientY);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (event: React.TouchEvent) => {
    if (!isDragging) return;
    const currentPos = event.touches[0].clientY;
    const offset = currentPos - startPos;
    setDragOffset(offset);
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!isDragging) return;
    if (dragOffset < 0 && isFull) return;
    setIsDragging(false);
    setDragOffset(0);

    const endPos = event.changedTouches[0].clientY;
    const distance = startPos - endPos;

    if (distance >= 90) {
      setIsFull(true);
    } else if (distance <= -90 && isFull) {
      setIsFull(false);
    } else if (distance <= -90 && !isFull) {
      onClose();
    }
  };

  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (hasOverlays) {
      body.style.overflow = "hidden";
    }
    return () => {
      body.style.removeProperty("overflow");
    };
  }, [hasOverlays, isDesktop]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: [1] },
    );

    const currentBarRef = barRef.current;
    if (currentBarRef) {
      observer.observe(currentBarRef);
    }

    return () => {
      if (currentBarRef) {
        observer.unobserve(currentBarRef);
      }
    };
  }, []);

  return (
    <>
      <div
        onClick={onClose}
        style={{ overflow: "hidden", backgroundColor: "transparent" }}
        className="fixed inset-0 flex items-center justify-center z-[2000] py-5"
      />
      <section
        data-open={controller.isOpen}
        data-desktop={isDesktop}
        data-full={isFull}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: isDragging
            ? `translate3d(-50%, ${
                isFull
                  ? `${Math.max(dragOffset, 0)}px`
                  : `max(calc(35vh + ${dragOffset}px), 1vh)`
              }, 0)`
            : undefined,
          transition: isDragging ? "none" : undefined,
        }}
        className={[
          "fixed left-1/2 top-0 bg-white rounded-t-card border-t-[1.5px] border-x-[1.5px] border-ink pb-8 min-h-screen w-full max-w-[520px]",
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
            <div
              ref={barRef}
              className="py-3 pl-4 pr-3 flex justify-end"
            >
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
