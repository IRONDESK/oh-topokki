import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";

const container = style({
  padding: "0 16px",
});

const header = style({
  padding: "4px 2px 14px",
  marginBottom: "10px",
  borderBottom: `1px solid ${theme.color.gray["200"]}`,
});

const item = style([
  flexs({ dir: "col", gap: "4" }),
  {
    cursor: "pointer",
    width: "100%",
    padding: "12px 4px",
    borderBottom: `1px solid ${theme.color.gray["100"]}`,
    selectors: {
      "&:last-of-type": {
        borderBottom: "none",
      },
    },
  },
]);

const empty = style({
  padding: "48px 0",
  textAlign: "center",
});

export const favoriteStyle = {
  container,
  header,
  item,
  empty,
};
