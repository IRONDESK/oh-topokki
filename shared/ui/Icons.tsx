// 사용하는 아이콘만 서브셋한 폰트/CSS (scripts/build-icons.mjs 로 생성)
import "@/shared/style/icons/uicons.css";
import type { IconName } from "@/shared/ui/icon-names";

type Props = {
  name: IconName;
  w?: "bold" | "solid" | "regular";
  t?: "round" | "straight";
  size?: number;
  color?: string;
};

function Icons({ name, w = "solid", t = "round", size = 16, color }: Props) {
  return (
    <i
      aria-hidden
      className={`fi fi-${w[0]}${t[0]}-${name}`}
      style={{
        fontSize: size,
        height: size,
        color,
        display: "inline-flex",
        alignItems: "center",
      }}
    />
  );
}

export default Icons;
