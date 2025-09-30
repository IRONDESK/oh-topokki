import { keyframes, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";
import { recipe } from "@vanilla-extract/recipes";

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

export const buttons = recipe({
  base: {
    flex: 1,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    wordBreak: "keep-all",
    selectors: {
      "&:disabled": {
        cursor: "not-allowed",
        backgroundColor: theme.color.gray["400"],
        opacity: 0.9,
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    },
  },
  variants: {
    fill: {
      primary: {
        backgroundColor: theme.color.primary["500"],
        color: theme.color.white,
      },
      secondary: {
        backgroundColor: theme.color.primary["100"],
        color: theme.color.primary["600"],
      },
    },
    size: {
      large: [
        fonts.body1.medium,
        {
          borderRadius: "20px",
          padding: "12px 24px",
          gap: "8px",
        },
      ],
      small: [
        fonts.body4.medium,
        {
          minWidth: "60px",
          borderRadius: "10px",
          padding: "8px 10px",
          gap: "4px",
        },
      ],
    },
  },
});

export const label = recipe({
  base: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    wordBreak: "keep-all",
    border: "1px solid",
    selectors: {
      "&:disabled": {
        cursor: "not-allowed",
        backgroundColor: theme.color.gray["400"],
        opacity: 0.9,
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    },
  },
  variants: {
    fill: {
      primary: {
        backgroundColor: theme.color.primary["500"],
        borderColor: theme.color.primary["50"],
        color: theme.color.white,
      },
      secondary: {
        borderColor: theme.color.primary["400"],
        color: theme.color.primary["600"],
      },
      gray: {
        backgroundColor: theme.color.gray["50"],
        borderColor: theme.color.gray["200"],
        color: theme.color.gray["600"],
      },
    },
    size: {
      large: [
        fonts.body3.medium,
        {
          borderRadius: "10px",
          padding: "6px 12px",
          gap: "4px",
        },
      ],
      small: [
        fonts.body4.medium,
        {
          minWidth: "52px",
          borderRadius: "8px",
          padding: "6px 8px",
          gap: "4px",
        },
      ],
    },
  },
});

export const shareStyle = { rotating };
