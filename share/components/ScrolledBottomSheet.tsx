import React, { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { overlayStyle } from "./css/modal.css";
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
        className={overlayStyle.dim}
        onClick={onClose}
        style={{ overflow: "hidden", backgroundColor: "transparent" }}
      />
      <section
        className={overlayStyle.bottomSheetContainer}
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
            <div ref={barRef} className={overlayStyle.desktopHeader}>
              <button
                type="button"
                className={overlayStyle.closeButton}
                onClick={onClose}
              >
                <Icons name="cross" w="bold" size={20} t="round" />
              </button>
            </div>
          ) : (
            <div className={overlayStyle.topDragger} ref={barRef} />
          )}
          {children({ isFull, isSticky })}
        </div>
      </section>
    </>
  );
}
