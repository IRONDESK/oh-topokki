import { keyframes, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const rotating = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

export const mainButton = style([
  fonts.body1.medium,
  {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.primary["500"],
    color: theme.color.white,
    borderRadius: "20px",
    padding: "12px 24px",
    cursor: "pointer",
    gap: "8px",
    selectors: {
      "&:disabled": {
        cursor: "not-allowed",
        backgroundColor: theme.color.gray["400"],
        opacity: 0.9,
      },
      "&[data-fill='secondary']": {
        backgroundColor: theme.color.primary["100"],
        color: theme.color.primary["600"],
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    },
  },
]);

export const shareStyle = { rotating };
