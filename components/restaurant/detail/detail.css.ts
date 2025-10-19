import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts, fontWeight, typo } from "@/style/typo.css";

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
  transition: "transform 0.25s, opacity 0.3s, border-radius 0.3s, padding 0.3s",
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
      padding: "env(safe-area-inset-top, 4px) 0 32px",
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
      padding: "10px 16px 12px",
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
  display: "flex",
  flexDirection: "column",
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
  paddingTop: "16px",
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
  flexShrink: 0,
  margin: "24px 0 18px",
  width: "100%",
  height: "9px",
  backgroundColor: theme.color.gray["100"],
});

const headReview = style({
  color: theme.color.gray["600"],
  borderRadius: "10px",
  whiteSpace: "pre-wrap",
});
const headReviewText = style([
  typo({
    size: "body1",
    weight: "semibold",
  }),
]);

const closeBtn = style({
  margin: "20px 0 8px",
  color: theme.color.gray["400"],
  textAlign: "center",
});

const loadingContainer = style({
  display: "flex",
  justifyContent: "center",
  margin: "48px auto",
});

const reviewContainer = style([
  {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
]);
const reviewInputContainer = style({
  position: "sticky",
  left: 0,
  bottom: "calc(env(safe-area-inset-bottom, 16px) + 10px)",
  margin: "0 -4px",
  width: "calc(100% + 8px)",
  minHeight: "60px",
});
const reviewInputBox = style({
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(256,256,256,0.75)",
  borderRadius: "32px",
  width: "100%",
  height: "48px",
  padding: "0 10px 0 16px",
  boxShadow: theme.shadow.md,
  backdropFilter: "blur(2px)",
  transition: "border 0.2s",
  border: "1px solid transparent",
  selectors: {
    "&:has(input:focus)": {
      border: `1px solid ${theme.color.primary["300"]}`,
    },
    "&:has(input:disabled)": {
      backgroundColor: theme.color.gray["100"],
    },
  },
});

const emptyReview = style([
  fonts.body3.medium,
  {
    margin: "40px auto 64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    color: theme.color.gray["500"],
  },
]);
const reviews = style([
  fonts.body4.regular,
  {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    margin: "6px 0 calc(env(safe-area-inset-bottom) + 32px)",
    paddingTop: "24px",
    color: theme.color.gray["700"],
    borderTop: `1px solid ${theme.color.gray["200"]}`,
  },
]);
const reviewItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});
const ratingLabel = style([
  fonts.caption1.medium,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    borderRadius: "4px",
    padding: "1px 4px",
    backgroundColor: theme.color.primary["50"],
    color: theme.color.primary["600"],
  },
]);
const bullet = style({
  flexShrink: 0,
  display: "inline-block",
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  backgroundColor: theme.color.gray["300"],
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
  loadingContainer,
  closeBtn,
  reviewContainer,
  reviewInputContainer,
  reviewInputBox,
  reviews,
  reviewItem,
  emptyReview,
  ratingLabel,
  bullet,
};
