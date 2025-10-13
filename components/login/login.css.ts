import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const inner = style({
  width: "100%",
  display: "flex",
  paddingBottom: "env(safe-area-inset-bottom)",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
});
const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "calc(100% + 40px)",
  margin: "-16px -20px 0",
  padding: "48px 20px 0",
  color: theme.color.gray["700"],
  whiteSpace: "pre-wrap",
  textAlign: "center",
});
const logoBox = style({
  display: "inline-flex",
  paddingTop: "4px",
  paddingRight: "2px",
  transform: "translateY(4px)",
});
globalStyle(`${logoBox} > svg`, {
  width: "116px",
  height: "auto",
});

const message = style([
  fonts.body2.medium,
  {
    width: "max-content",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    margin: "0 auto 160px",
    padding: "20px 16px",
    minWidth: "60%",
    backgroundColor: theme.color.primary["50"],
    borderRadius: "8px",
    border: `1px solid ${theme.color.primary["100"]}`,
    color: theme.color.primary["600"],
  },
]);

const button = style([
  fonts.body2.medium,
  {
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    justifyContent: "center",
    padding: "16px 0",
    textAlign: "center",
    borderRadius: "12px",
    selectors: {
      '&[data-provider="kakao"]': {
        backgroundColor: "#FEE500",
      },
      '&[data-provider="naver"]': {
        color: theme.color.white,
        backgroundColor: "rgba(3,199,90,1)",
      },
    },
  },
]);

export const loginStyle = { inner, container, logoBox, message, button };
