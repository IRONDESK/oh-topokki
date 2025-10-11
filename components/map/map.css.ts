import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";
import { flexs } from "@/style/container.css";

const mapContainer = style({
  position: "relative",
  width: "100%",
  height: "calc(100vh - 1px)",
  overflow: "hidden",
});

const loadingOverlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
});

const errorOverlay = style([
  fonts.body3.regular,
  {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    top: "20px",
    left: "16px",
    right: "16px",
    color: theme.color.white,
    backgroundColor: theme.color.red["500"],
    padding: "12px 16px",
    borderRadius: "14px",
    boxShadow: theme.shadow.md,
    maxWidth: "520px",
    zIndex: 1000,
    marginTop: "env(safe-area-inset-top)",
    backdropFilter: "blur(5px)",
  },
]);

const restaurantCount = style([
  fonts.body3.regular,
  {
    position: "fixed",
    padding: "4px 12px",
    left: "50%",
    bottom: "calc(env(safe-area-inset-bottom) + 52px)",
    marginBottom: "24px",
    backgroundColor: "rgba(0,0,0,0.4)",
    color: theme.color.white,
    backdropFilter: "blur(4px)",
    borderRadius: "20px",
    boxShadow: theme.shadow.sm,
    zIndex: 1000,
    letterSpacing: "-0.05rem",
    transition: "transform 0.35s, opacity 0.3s",
    transitionDelay: "0.15s",
    selectors: {
      "&[data-loading='true']": {
        transform: "translate3d(-50%, 100%, 0)",
        opacity: 0,
      },
      "&[data-loading='false']": {
        transform: "translate3d(-50%, 0, 0)",
        opacity: 1,
      },
    },
  },
]);

const container = style([
  flexs({ dir: "col", gap: "4", align: "start" }),
  {
    backgroundColor: "rgba(256,256,256,0.6)",
    borderRadius: "18px",
    padding: "12px",
    backdropFilter: "blur(4px)",
    borderTop: "1px solid #fff",
    borderLeft: "1px solid #fff",
    boxShadow: theme.shadow.lg,
  },
]);
const title = style([
  fonts.body3.semibold,
  {
    color: theme.color.gray["700"],
  },
]);
const infoTag = style([
  fonts.caption1.medium,
  {
    display: "inline-flex",
    padding: "1px 6px",
    backgroundColor: theme.color.primary["50"],
    color: theme.color.primary["500"],
    borderRadius: "3px",
    gap: "2px",
    alignItems: "center",
    selectors: {
      "&[data-type='price']": {
        backgroundColor: "transparent",
        padding: "1px",
        color: theme.color.gray["600"],
      },
    },
  },
]);
const refreshBtn = style([
  fonts.body4.medium,
  { cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" },
]);
const description = style([
  fonts.caption1.regular,
  {
    color: theme.color.gray["600"],
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
]);

export const mapStyle = {
  mapContainer,
  loadingOverlay,
  errorOverlay,
  restaurantCount,
  refreshBtn,
};
export const hoverStyle = { container, title, description, infoTag };
