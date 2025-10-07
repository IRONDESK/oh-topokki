import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const container = style({
  width: "calc(100% + 40px)",
  margin: "-16px -20px 0",
  padding: "16px 20px 24px",
  backgroundColor: theme.color.primary["600"],
  color: theme.color.white,
  whiteSpace: "pre-wrap",
});

const button = style([
  fonts.body3.regular,
  {
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    justifyContent: "center",
    padding: "12px 0",
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

export const loginStyle = { container, button };
