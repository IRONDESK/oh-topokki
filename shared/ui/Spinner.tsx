type ColorName = "primary" | "gray" | "white";

type Props = {
  color?: ColorName;
  size?: number;
  thick?: number;
};

const BORDER_COLOR: Record<ColorName, string> = {
  primary: "var(--color-primary-200)",
  gray: "var(--color-gray-200)",
  white: "rgba(255,255,255,0.5)",
};
const HIGHLIGHT_COLOR: Record<ColorName, string> = {
  primary: "var(--color-primary-600)",
  gray: "var(--color-gray-600)",
  white: "var(--color-white)",
};

function Spinner(props: Props) {
  const { color = "primary", size = 24, thick = 2 } = props;
  return (
    <div
      className="rounded-full animate-spin"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${thick}px solid ${BORDER_COLOR[color]}`,
        borderRightColor: HIGHLIGHT_COLOR[color],
      }}
    />
  );
}

export default Spinner;
