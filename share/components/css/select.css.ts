import { style } from "@vanilla-extract/css";
import { fonts } from "@/style/typo.css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";

const label = style([
  flexs({ justify: "center" }),
  {
    position: "relative",
    cursor: "pointer",
    width: "100%",
    border: "1px solid",
    borderColor: theme.color.gray["200"],
    borderRadius: "8px",
    padding: "12px",
    alignItems: "stretch",
    selectors: {
      "&:has(input:checked)": {
        backgroundColor: theme.color.primary[50],
        borderColor: theme.color.primary[200],
        color: theme.color.primary["600"],
      },
    },
  },
]);
const dropdownBox = style([
  flexs({ gap: "4", justify: "spb" }),
  fonts.body3.regular,
  {
    flex: 1,
    selectors: {
      "&[data-placeholder='true']": {
        color: theme.color.gray["500"],
      },
    },
  },
]);
const dropdownItems = style({
  userSelect: "none",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "10px 0",
  border: `1px solid ${theme.color.gray["200"]}`,
  borderRadius: "8px",
  backgroundColor: theme.color.white,
});
const dropdownItem = style([
  fonts.body3.regular,
  {
    padding: "10px 16px",
    selectors: {
      "&:hover": {
        backgroundColor: theme.color.primary["50"],
      },
      "&:active": {
        backgroundColor: theme.color.primary["100"],
      },
      "&[data-active='true']": {
        backgroundColor: theme.color.primary["50"],
        color: theme.color.primary["600"],
      },
    },
  },
]);

export const selectStyle = {
  label,
  dropdownBox,
  dropdownItems,
  dropdownItem,
};
