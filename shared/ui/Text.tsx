type ColorName = "gray" | "success" | "info" | "warning" | "red" | "purple" | "magenta" | "primary";
type ColorShade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export const Text = (props: {
  className?: string;
  display?: "inline" | "inline-block" | "block" | "flex" | "inline-flex";
  color: `${ColorName}-${ColorShade}` | "white" | "black";
  children: React.ReactNode;
}) => {
  const { color, display, className, children } = props;

  const colorValue =
    color === "white" || color === "black"
      ? `var(--color-${color})`
      : `var(--color-${color})`;

  return (
    <span
      className={className}
      style={{ display, color: colorValue }}
    >
      {children}
    </span>
  );
};
