import { style } from "@vanilla-extract/css";
import { flexs } from "@/style/container.css";
import { global, theme } from "@/style/theme.css";

const header = style([
  flexs({ justify: "spb", align: "start" }),
  {
    padding: "calc(18px + env(safe-area-inset-top)) 14px 12px",
  },
]);

const closeButton = style({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.color.gray[500],

  ":hover": {
    backgroundColor: theme.color.gray[100],
    color: theme.color.gray[700],
  },
});

const dim = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  padding: "20px 0",
});

const modal = style({
  backgroundColor: theme.color.white,
  overflow: "hidden",
  padding: "0 0 env(safe-area-inset-bottom, 20px)",
  display: "flex",
  flexDirection: "column",
  zIndex: 20,
  width: "100vw",
  height: "100vh",
  maxWidth: "none",
  minHeight: "100vh",
  borderRadius: 0,
  "@media": {
    "(min-width: 1280px)": {
      width: "100%",
      maxWidth: global.size.overlayMaxWidth,
      padding: 0,
      minHeight: "95vh",
      height: "95vh",
      borderRadius: "32px",
    },
  },
});
const content = style([
  flexs({ dir: "col", align: "start", justify: "start" }),
  {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px 32px",
  },
]);

const bottomSheetContainer = style({
  position: "fixed",
  left: "50%",
  top: 0,
  backgroundColor: theme.color.white,
  borderRadius: "20px 20px 0 0",
  padding: "0 0 32px",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "520px",
  transform: "translate3d(-50%, 98vh, 0)",
  transition: "transform 0.25s, opacity 0.3s, border-radius 0.3s, padding 0.3s",
  color: theme.color.gray["700"],
  opacity: 0,
  zIndex: 2005,
  overscrollBehavior: "contain",
  willChange: "transform",
  selectors: {
    "&[data-open='true']": {
      transform: "translate3d(-50%, 35vh, 0)",
      opacity: 1,
      boxShadow: theme.shadow.md,
    },
    "&[data-full='true']": {
      transform: "translate3d(-50%, 0, 0)",
      padding: "env(safe-area-inset-top, 4px) 0 32px",
      borderRadius: 0,
      opacity: 1,
      overflowY: "auto",
    },
  },
});

const topDragger = style({
  width: "15%",
  height: "4px",
  borderRadius: "99px",
  backgroundColor: theme.color.gray["200"],
  margin: "18px auto 12px",
});

const desktopHeader = style({
  padding: "12px 12px 0 16px",
  display: "flex",
  justifyContent: "flex-end",
});

export const overlayStyle = {
  dim,
  modal,
  content,
  closeButton,
  header,
  bottomSheetContainer,
  desktopHeader,
  topDragger,
};
