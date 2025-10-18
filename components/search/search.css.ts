import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";
import { flexs, fullwidth } from "@/style/container.css";

const container = style({
  padding: "0 16px",
});

const resultPin = style([
  fonts.body4.semibold,

  {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.primary["600"],
    color: theme.color.white,
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    marginTop: "-4px",
    selectors: {
      "&::after": {
        position: "absolute",
        content: "",
        display: "block",
        borderRadius: "2px",
        backgroundColor: theme.color.primary["600"],
        width: "12px",
        height: "12px",
        transform: "rotate(45deg)",
        top: "14.5px",
        zIndex: "-1",
      },
    },
  },
]);

const inputContainer = style({
  padding: "4px 2px 10px",
  marginBottom: "10px",
  borderBottom: `1px solid ${theme.color.gray["200"]}`,
});

const resultItem = style([
  flexs({ gap: "12", justify: "start" }),
  {
    cursor: "pointer",
    width: "100%",
    selectors: {
      "&:first-of-type": {
        paddingTop: "10px",
      },
    },
  },
]);

const matchedKeyword = style([
  fonts.caption1.medium,
  {
    padding: "2px 4px",
    borderRadius: "2px",
    backgroundColor: theme.color.primary["50"],
    color: theme.color.primary["600"],
  },
]);

export const searchStyle = {
  container,
  resultPin,
  inputContainer,
  resultItem,
  matchedKeyword,
};
