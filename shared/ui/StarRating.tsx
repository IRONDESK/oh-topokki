import { useState } from "react";
import Icons from "@/shared/ui/Icons";
import { cn } from "@/shared/lib/cn";

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** hover 중인 별점(1~5), 벗어나면 0. 문구 미리보기 등에 사용 */
  onHover?: (value: number) => void;
  size?: number;
  className?: string;
};

const STARS = [1, 2, 3, 4, 5];

/** 1~5점 별점 선택. hover 시 해당 별점까지 연한 색으로 미리 채워진다. */
export default function StarRating({
  value,
  onChange,
  onHover,
  size = 18,
  className,
}: Props) {
  const [hovered, setHovered] = useState(0);

  const hover = (n: number) => {
    setHovered(n);
    onHover?.(n);
  };

  return (
    <span
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={() => hover(0)}
    >
      {STARS.map((n) => {
        const selected = n <= value;
        const previewed = !selected && n <= hovered;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => hover(n)}
            aria-label={`별점 ${n}점`}
            className="cursor-pointer"
          >
            <Icons
              name="star"
              w={selected || previewed ? "solid" : "regular"}
              size={size}
              color={
                selected
                  ? "var(--color-primary-500)"
                  : previewed
                    ? "var(--color-primary-200)" // hover 미리보기: 살짝 채움
                    : "var(--color-gray-300)"
              }
            />
          </button>
        );
      })}
    </span>
  );
}
