import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const container = style({
  userSelect: "none",
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  marginBottom: "calc(env(safe-area-inset-bottom, 16px) - 4px)",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  paddingBottom: "16px",
  width: "min(90vw, 380px)",
});
const button = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "max-content",
  wordBreak: "keep-all",
  boxShadow: theme.shadow.sm,
  minHeight: "52px",
  gap: "2px",
  color: theme.color.gray["700"],
});
const mainButton = style([
  fonts.body3.semibold,
  {
    flex: 1.7,
    height: "52px",
    backgroundColor: "rgba(245, 78, 38, 0.73) !important",
    color: theme.color.white,
    borderColor: "rgba(245, 78, 38, 0.55) !important",
    gap: "6px",
    letterSpacing: "-0.05rem",
  },
]);

const btnText = style([
  fonts.caption1.regular,
  { color: theme.color.gray["600"] },
]);

export const navigationStyle = {
  container,
  mainButton,
  button,
  btnText,
};
