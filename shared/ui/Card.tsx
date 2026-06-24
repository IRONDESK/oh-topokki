import { ComponentProps } from "react";
import clsx from "clsx";

/** 분식집 스티커 카드 컨테이너 — 흰 면 + 잉크 외곽선 + 오프셋 그림자. */
export default function Card({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "bg-white border-[1.5px] border-ink rounded-card shadow-sticker",
        className,
      )}
      {...rest}
    />
  );
}
