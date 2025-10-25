import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { flexs } from "@/style/container.css";
import { fonts, fontWeight } from "@/style/typo.css";

const container = style([
  flexs({ justify: "spb", gap: "8" }),
  fonts.body3.regular,
  {
    position: "fixed",
    top: 0,
    width: "calc(min(1280px, 100vw))",
    minHeight: "48px",
    padding: "env(safe-area-inset-top, 16px) 0 0 10px",
    zIndex: 1000,
  },
]);
const headerLogo = style([
  flexs({ justify: "center" }),
  {
    width: "100px",
    height: "48px",
    filter: "drop-shadow(0 0 8px rgba(256, 256, 256, 0.75))",
  },
]);

const filterList = style({
  flex: 1,
  display: "inline-flex",
  gap: "4px",
  overflowX: "auto",
  paddingRight: "16px",
});
const filterItem = style([
  fonts.body3.medium,
  {
    flexShrink: 0,
    userSelect: "none",
    cursor: "pointer",
    minWidth: "54px",
    padding: "5px 14px",
    borderRadius: "32px",
    backgroundColor: "rgba(256,256,256,0.65)",
    backdropFilter: "blur(4px)",
    borderTop: "1px solid",
    borderLeft: "1px solid",
    borderColor: theme.color.white,
    textAlign: "center",
    color: theme.color.gray["600"],
    boxShadow: theme.shadow.sm,
    selectors: {
      "&:hover": {
        filter: "brightness(1.05)",
      },
      '&[data-selected="true"]': {
        backgroundColor: theme.color.primary["500"],
        borderColor: theme.color.primary["200"],
        color: theme.color.white,
        fontWeight: fontWeight.semibold,
      },
    },
  },
]);

const menu = style({
  cursor: "pointer",
  width: "36px",
  height: "32px",
  borderRadius: "6px",
  backgroundColor: theme.color.primary["500"],
  color: theme.color.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderLeft: "1px solid rgba(245, 78, 38, 0.55)",
  borderTop: "1px solid rgba(245, 78, 38, 0.55)",
  borderRight: "1px solid transparent",
  borderBottom: "1px solid transparent",
});

export const mapHeaderStyle = {
  container,
  headerLogo,
  filterList,
  filterItem,
  menu,
};
