import { style } from "@vanilla-extract/css";
import { theme } from "@/style/theme.css";

export const container = style({
  position: "relative",
  width: "100%",
  height: "100vh",
});

export const loadingOverlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});

export const errorOverlay = style({
  position: "absolute",
  top: "20px",
  left: "20px",
  right: "20px",
  backgroundColor: "white",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: theme.shadow.md,
  border: `2px solid ${theme.color.red[500]}`,
  zIndex: 1000,
});

export const restaurantCount = style({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  backgroundColor: "white",
  padding: "10px 15px",
  borderRadius: "20px",
  boxShadow: theme.shadow.sm,
  fontSize: "14px",
  color: theme.color.gray[700],
  fontWeight: "500",
  zIndex: 1000,
});
