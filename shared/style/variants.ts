import { cva, type VariantProps } from "class-variance-authority";

/**
 * 기존 vanilla-extract typo/buttons/label 호출 시그니처를 Tailwind 표준 유틸로 매핑한 CVA 평행 구현.
 * 사이즈 토큰은 Tailwind 기본 typography 스케일에 1:1로 매칭(정확 일치하지 않으면 가장 가까운 값).
 */

/**
 * 기존 사이즈 키 → Tailwind 기본 typography 매핑
 * - head5(32px) → text-3xl(30px)
 * - head6(24px) → text-2xl(24px)  exact
 * - body1(20px) → text-xl(20px)   exact
 * - body2(18px) → text-lg(18px)   exact
 * - body3(16px) → text-base(16px) exact
 * - body4(14px) → text-sm(14px)   exact
 * - caption1(12px) → text-xs(12px) exact
 */
export const typo = cva("", {
  variants: {
    size: {
      head5: "text-3xl",
      head6: "text-2xl",
      body1: "text-xl",
      body2: "text-lg",
      body3: "text-base",
      body4: "text-sm",
      caption1: "text-xs",
    },
  },
});

export const fixedBottom =
  "fixed bottom-0 left-0 flex items-center gap-2 w-screen bg-white border-t-[1.5px] border-ink px-4 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))] z-[100] xl:left-1/2 xl:-translate-x-1/2 xl:w-[var(--size-overlay-max)]";

export const mainButton =
  "flex flex-1 items-center justify-center gap-2 bg-primary-500 text-white border-[1.5px] border-ink rounded-btn px-6 py-3 cursor-pointer text-xl font-medium shadow-pop " +
  "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none " +
  "data-[fill=secondary]:bg-primary-100 data-[fill=secondary]:text-primary-700 " +
  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-[transform,box-shadow] duration-150";

export const buttons = cva(
  "flex flex-1 shrink-0 items-center justify-center cursor-pointer break-keep border-[1.5px] transition-[transform,box-shadow] duration-150 " +
    "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none " +
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      fill: {
        primary: "bg-primary-500 text-white border-ink shadow-pop",
        secondary:
          "bg-primary-100 text-primary-700 border-ink shadow-sticker-sm",
        outlined:
          "bg-white border-primary-400 text-primary-700 active:bg-primary-50",
        assistive: "bg-white border-gray-300 text-gray-600 active:bg-gray-50",
      },
      size: {
        large: "rounded-btn px-6 py-3 gap-2 h-[52px] text-xl font-medium",
        medium:
          "rounded-[12px] px-4 py-2.5 gap-1 h-[46px] text-base font-medium",
        small:
          "min-w-[60px] rounded-[10px] px-2.5 py-2 gap-1 h-[38px] text-sm font-medium",
      },
    },
  },
);
export type ButtonsProps = VariantProps<typeof buttons>;

export const label = cva(
  "inline-flex shrink-0 items-center justify-center break-keep border gap-1 tracking-[-0.01em] " +
    "disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-90 active:scale-[0.98]",
  {
    variants: {
      fill: {
        primary: "bg-primary-500 border-ink text-white",
        secondary: "bg-primary-50 border-primary-300 text-primary-700",
        assistive: "bg-gray-100/80 border-gray-200 text-gray-600",
        gray: "bg-gray-50 border-gray-200 text-gray-600",
        pink: "bg-magenta-50 border-magenta-200 text-magenta-700",
        yellow: "bg-warning-50 border-warning-300 text-warning-800",
      },
      size: {
        large: "rounded-[10px] px-3 py-1.5 gap-1 text-base font-medium",
        small: "min-w-[52px] rounded-lg px-2 py-1 gap-1 text-sm font-medium",
      },
    },
  },
);
export type LabelProps = VariantProps<typeof label>;

/* 분식집 스티커 컨테이너 — 글래스모피즘 대신 솔리드 흰 면 + 잉크 외곽선 + 오프셋 그림자 */
export const glassContainer =
  "cursor-pointer flex items-center justify-center w-12 h-12 rounded-chip bg-white border-[1.5px] border-ink shadow-sticker-sm " +
  "data-[flexible=true]:px-3.5 data-[flexible=true]:min-w-12 data-[flexible=true]:w-auto " +
  "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow] duration-150 " +
  "text-base font-medium";
