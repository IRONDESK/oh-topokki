import { globalStyle, style } from "@vanilla-extract/css";
import { global, theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";
import { fonts, fontSize } from "@/style/typo.css";

export const searchResults = style({
  flex: 1,
  width: "calc(100% + 40px)",
  display: "flex",
  flexDirection: "column",
  margin: "20px -20px 0",
  paddingBottom: global.size.safeFixedBottom,
});

export const searchResult = style({
  padding: "16px 22px",
  cursor: "pointer",

  ":hover": {
    borderColor: theme.color.primary[300],
    backgroundColor: theme.color.primary[50],
  },
});

export const form = style({
  display: "grid",
  gap: "24px",
  width: "100%",
  paddingBottom: global.size.safeFixedBottom,
});

export const backBtn = style([
  flexs({ gap: "6" }),
  fonts.body4.medium,
  {
    flexShrink: 0,
    cursor: "pointer",
    backgroundColor: theme.color.gray["100"],
    borderRadius: "999px",
    padding: "8px 14px",
    color: theme.color.gray["700"],
    selectors: {
      "&:hover": {
        backgroundColor: theme.color.gray["200"],
      },
      "&:active": {
        backgroundColor: theme.color.gray["300"],
      },
    },
  },
]);

export const section = style([
  flexs({ dir: "col", gap: "4", align: "start" }),
  { width: "100%" },
]);
globalStyle(`${section} > h4`, {
  color: theme.color.gray["500"],
  ...fontSize.body4,
});

export const category = style([
  fonts.caption1.regular,
  {
    backgroundColor: theme.color.primary["100"],
    color: theme.color.primary["700"],
    padding: "2px 6px",
    borderRadius: "4px",
  },
]);
