import { globalStyle, style } from "@vanilla-extract/css";
import { flexs } from "@/style/container.css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const container = style({
  position: "relative",
  width: "100%",
});
const placeholder = style({
  position: "absolute",
  left: 0,
  top: 0,
  color: theme.color.gray["400"],
  transition: "all 0.25s",
  selectors: {
    "&[data-hide='true']": {
      opacity: 0,
      transform: "translateY(-50%)",
    },
  },
});
const inputPlaceholder = style([fonts.head5.medium, placeholder]);
const textareaPlaceholder = style([fonts.head6.regular, placeholder]);
const input = style([
  fonts.head5.medium,
  {
    position: "relative",
    width: "100%",
    color: theme.color.gray["700"],
    zIndex: 1,
    caretColor: theme.color.primary["600"],
    selectors: {
      "&::-webkit-outer-spin-button": {
        appearance: "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0,
      },
    },
  },
]);
const inputCssHiding = style([input, {}]);
globalStyle(
  `${inputCssHiding}:not(:placeholder-shown) + span.${inputPlaceholder}`,
  {
    opacity: 0,
    transform: "translateY(-50%)",
  },
);
const textarea = style([
  fonts.head6.regular,
  {
    position: "relative",
    color: theme.color.gray["700"],
    zIndex: 1,
    caretColor: theme.color.primary["600"],
  },
]);

export const inputStyle = {
  container,
  inputPlaceholder,
  textareaPlaceholder,
  input,
  inputCssHiding,
  textarea,
};
