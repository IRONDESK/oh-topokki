import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const container = style({
  position: "fixed",
  top: 0,
  marginTop: "env(safe-area-inset-top, 16px)",
  left: "10px",
  padding: "14px 16px",
  borderLeft: "1px solid #fff",
  borderTop: "1px solid #fff",
  borderRight: "1px solid transparent",
  borderBottom: "1px solid transparent",
  backgroundColor: "rgba(256,256,256,0.55)",
  boxShadow: theme.shadow.md,
  backdropFilter: "blur(4px)",
  borderRadius: "20px",
  minWidth: "160px",
  transform: "translate3d(0,0,0) scale(0.2)",
  opacity: 0,
  filter: "brightness(1.05)",
  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ",
  transformOrigin: "top left",
  whiteSpace: "pre-wrap",
  textAlign: "left",
  selectors: {
    "&[data-open='true']": {
      opacity: 1,
      transform: "translate3d(0,50px,0) scale(1)",
    },
  },
});

const list = style([
  fonts.body4.regular,
  {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    color: theme.color.gray["600"],
    borderTop: `1px solid ${theme.color.gray["300"]}`,
    width: "100%",
    marginTop: "12px",
    paddingTop: "12px",
  },
]);
globalStyle(`${list} > li`, {
  cursor: "pointer",
  padding: "4px 0",
});

export const floatingStyle = { container, list };
