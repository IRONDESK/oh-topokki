import { style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { global, theme } from "@/style/theme.css";

export const flexs = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  variants: {
    flex: {
      1: { flex: 1 },
      2: { flex: 2 },
      3: { flex: 3 },
    },
    justify: {
      center: { justifyContent: "center" },
      spb: { justifyContent: "space-between" },
      start: { justifyContent: "flex-start" },
      end: { justifyContent: "flex-end" },
    },
    align: {
      start: { alignItems: "flex-start" },
      end: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" },
    },
    dir: {
      row: { flexDirection: "row" },
      col: { flexDirection: "column" },
    },
    gap: {
      "0": { gap: "0px" },
      "2": { gap: "2px" },
      "4": { gap: "4px" },
      "6": { gap: "6px" },
      "8": { gap: "8px" },
      "12": { gap: "12px" },
      "16": { gap: "16px" },
      "20": { gap: "20px" },
      "24": { gap: "24px" },
      "32": { gap: "32px" },
    },
  },
  defaultVariants: {
    justify: "center",
    dir: "row",
    gap: "0",
  },
});

export const fullwidth = style({
  width: "100%",
});
export const flexRatio = styleVariants({
  1: { flex: 1 },
  2: { flex: 2 },
  3: { flex: 3 },
});

export const fixedBottom = style({
  position: "fixed",
  bottom: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100vw",
  backgroundColor: theme.color.white,
  padding: "16px 16px calc(24px + env(safe-area-inset-bottom))",
  zIndex: 100,
  boxShadow: theme.shadow.md,
  "@media": {
    "(min-width: 1280px)": {
      width: global.size.overlayMaxWidth,
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
});
