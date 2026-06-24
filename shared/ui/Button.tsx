import { ComponentProps } from "react";
import clsx from "clsx";
import { buttons, type ButtonsProps } from "@/shared/style/variants";

type Props = ComponentProps<"button"> & ButtonsProps;

/** 분식집 스티커 스타일 공통 버튼. fill/size는 variants.ts의 cva 토큰을 그대로 사용. */
export default function Button({
  fill = "primary",
  size = "large",
  className,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={clsx(buttons({ fill, size }), className)}
      {...rest}
    />
  );
}
