import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";
import { fonts, fontWeight } from "@/style/typo.css";

const container = style([
    flexs({ justify: "spb", align: "center" }),
    {
        minHeight: "64px",
        padding: "calc(env(safe-area-inset-top) + 8px) 16px 8px",
        borderBottom: `1px solid ${theme.color.gray["100"]}`
    }
]);
const title = style([
    fonts.body3.medium,
    {
        textAlign: "cetner",
        color: theme.color.gray["700"]
    }
]);
const button = style({
    cursor: "pointer",
    width: "24px",
    height: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    selectors: {
        '&[data-empty="true"]': {
          cursor: "default",
          visibility: "hidden",
      },
    }
});

export const pageHeaderStyle = { container, title, button };