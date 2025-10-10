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

export const overlayStyle = { dim, modal, content, closeButton, header };
