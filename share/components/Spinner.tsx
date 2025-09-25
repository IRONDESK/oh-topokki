import { theme } from "@/style/theme.css";
import { shareStyle } from "@/share/components/css/share.css";

type Props = {
  color?: "primary" | "gray" | "white";
  size?: number;
  thick?: number;
};

function Spinner(props: Props) {
  const { color = "primary", size = 24, thick = 2 } = props;
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "100%",
        border: `${thick}px solid ${color === "white" ? "rgba(256,256,256,0.5)" : theme.color[color]["200"]}`,
        borderRightColor:
          color === "white" ? theme.color.white : theme.color[color]["600"],
        animation: `${shareStyle.rotating} 1s linear infinite`,
      }}
    ></div>
  );
}

export default Spinner;
