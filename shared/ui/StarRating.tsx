import Icons from "@/shared/ui/Icons";
import { cn } from "@/shared/lib/cn";

type Props = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
};

const STARS = [1, 2, 3, 4, 5];

/** 1~5점 별점 선택 */
export default function StarRating({
  value,
  onChange,
  size = 18,
  className,
}: Props) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`별점 ${n}점`}
          className="cursor-pointer"
        >
          <Icons
            name="star"
            w={n <= value ? "solid" : "regular"}
            size={size}
            color={
              n <= value ? "var(--color-primary-500)" : "var(--color-gray-300)"
            }
          />
        </button>
      ))}
    </span>
  );
}
