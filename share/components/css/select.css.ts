import { style } from "@vanilla-extract/css";
import { fonts } from "@/style/typo.css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";

const label = style([
  flexs({ justify: "center" }),
  {
    cursor: "pointer",
    width: "100%",
    height: "100%",
    border: "1px solid",
    borderColor: theme.color.gray["200"],
    borderRadius: "8px",
    padding: "12px",
    alignItems: "stretch",
    selectors: {
      "&:has(input:checked)": {
        backgroundColor: theme.color.primary[50],
        borderColor: theme.color.primary[200],
      },
    },
  },
]);

export const selectStyle = { label };
