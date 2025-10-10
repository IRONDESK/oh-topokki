import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts, fontSize, fontWeight, typo } from "@/style/typo.css";

const container = style({
  position: "fixed",
  left: "50%",
  top: 0,
  backgroundColor: theme.color.white,
  borderRadius: "20px 20px 0 0",
  padding: "0 0 32px",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "520px",
  transform: "translate3d(-50%, 98vh, 0)",
  transition: "transform 0.25s, opacity 0.3s, border-radius 0.3s",
  color: theme.color.gray["700"],
  opacity: 0,
  zIndex: 2005,
  overscrollBehavior: "contain",
  selectors: {
    "&[data-open='true']": {
      transform: "translate3d(-50%, 35vh, 0)",
      opacity: 1,
      boxShadow: theme.shadow.md,
    },
    "&[data-full='true']": {
      transform: "translate3d(-50%, 0, 0)",
      borderRadius: 0,
      opacity: 1,
      overflowY: "auto",
    },
  },
});
const innerPadding = style({
  padding: "0 20px",
});
const stickyArea = style({
  position: "sticky",
  backgroundColor: theme.color.white,
  top: 0,
  selectors: {
    "&[data-sticky='true']": {
      display: "flex",
      gap: "4px",
      alignItems: "center",
      padding: "calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px",
      boxShadow: theme.shadow.lg,
      zIndex: 10,
    },
  },
});
const topokkiType = style([
  typo({
    size: "body4",
    weight: "medium",
    color: "primary500",
  }),
  {
    selectors: {
      "&[data-sticky='true']": {
        backgroundColor: theme.color.primary["100"],
        color: theme.color.primary["600"],
        padding: "0 4px",
        borderRadius: "4px",
        fontWeight: fontWeight.semibold,
      },
    },
  },
]);

const bar = style({
  width: "15%",
  height: "4px",
  borderRadius: "99px",
  backgroundColor: theme.color.gray["200"],
  margin: "18px auto 12px",
});
const contents = style({
  height: "100%",
});
const detailItems = style([
  fonts.body3.regular,
  {
    display: "grid",
    gridTemplateColumns: "min(30%, 100px) 1fr",
    gap: "12px 6px",
  },
]);
globalStyle(`${detailItems} > dt`, {
  fontWeight: fontWeight.semibold,
  color: theme.color.gray["600"],
});
const price = style({
  margin: "16px 0",
  paddingTop: "10px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  borderTop: `1px solid ${theme.color.gray["200"]}`,
});
const spicy = style({
  color: theme.color.primary["200"],
  selectors: {
    "&[data-active='true']": {
      color: theme.color.primary["600"],
    },
  },
});
const sidemenu = style([
  fonts.body4.semibold,
  {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 4px",
    backgroundColor: theme.color.gray["100"],
    color: theme.color.gray["600"],
    borderRadius: "4px",
  },
]);

const divider = style({
  margin: "16px 0 12px",
  width: "100%",
  height: "9px",
  backgroundColor: theme.color.gray["100"],
});

const headReview = style({
  position: "relative",
  margin: "0 auto",
  color: theme.color.gray["600"],
  borderRadius: "10px",
  textAlign: "center",

  selectors: {
    "&::before": {
      position: "absolute",
      content: "❝",
      left: "-10px",
      top: "-2px",
      fontSize: "2.8rem",
      color: theme.color.gray["300"],
      opacity: 0.6,
    },
  },
});
const headReviewText = style([
  typo({
    size: "body3",
    weight: "semibold",
  }),
  {
    position: "relative",
    zIndex: 1,
    paddingTop: "4px",
  },
]);
const bottomPosition = style({
  paddingBottom: "calc(env(safe-area-inset-bottom, 32px) + 48px)",
});

export const detailStyle = {
  container,
  innerPadding,
  stickyArea,
  bar,
  topokkiType,
  contents,
  detailItems,
  price,
  spicy,
  sidemenu,
  divider,
  headReview,
  headReviewText,
  bottomPosition,
};
