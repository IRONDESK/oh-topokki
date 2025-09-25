import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";
import { fonts, fontWeight } from "@/style/typo.css";

export const mainContainer = style({
  maxWidth: "1280px",
  width: "100%",
  height: "100vh",
  backgroundColor: "#fff",
  margin: "0 auto",
});

const container = style([
  flexs({ justify: "spb", gap: "8" }),
  fonts.body3.regular,
  {
    position: "fixed",
    top: "16px",
    width: "calc(min(1280px, 100vw))",
    height: "48px",
    padding: "0 16px",
    zIndex: 1000,
  },
]);
const headerLogo = style([
  flexs({ justify: "center" }),
  {
    width: "80px",
    height: "48px",
    borderRadius: "40px",
    backgroundColor: theme.color.primary["500"],
    color: theme.color.white,
    boxShadow: theme.shadow.md,
  },
]);
const headerSearch = style({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "32px",
  backgroundColor: "rgba(256,256,256,0.3)",
  boxShadow: theme.shadow.md,
  backdropFilter: "blur(4px)",
  borderTop: "1px solid #fff",
  borderLeft: "1px solid #fff",
});
const filterList = style({
  flex: 1,
  display: "flex",
  gap: "4px",
  overflowX: "auto",
});
const filterItem = style([
  fonts.body3.medium,
  {
    userSelect: "none",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "32px",
    backgroundColor: theme.color.white,
    border: ` 1px solid ${theme.color.gray["200"]}`,
    selectors: {
      "&:hover": {
        borderColor: theme.color.gray["300"],
        backgroundColor: theme.color.gray["50"],
      },
      '&[data-selected="true"]': {
        backgroundColor: theme.color.primary["400"],
        borderColor: "transparent",
        color: theme.color.white,
        fontWeight: fontWeight.semibold,
      },
    },
  },
]);
export const headerStyle = {
  container,
  headerLogo,
  headerSearch,
  filterList,
  filterItem,
};
