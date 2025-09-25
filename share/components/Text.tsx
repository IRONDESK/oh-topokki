import { theme } from "@/style/theme.css";

type ColorKeys = Exclude<keyof typeof theme.color, "white" | "black">;
type ColorRangeKeys = keyof typeof theme.color.gray;

export const Text = (props: {
  className?: string;
  display?: "inline" | "inline-block" | "block" | "flex" | "inline-flex";
  color: `${ColorKeys}-${ColorRangeKeys}` | "white" | "black";
  children: React.ReactNode;
}) => {
  const { color, display, className, children } = props;
  const [key, range] = color.split("-");
  return (
    <span
      className={className}
      style={{
        display,
        color: !range
          ? theme.color?.[key as "white" | "black"]
          : theme.color?.[key as ColorKeys]?.[
              range as unknown as ColorRangeKeys
            ],
      }}
    >
      {children}
    </span>
  );
};
