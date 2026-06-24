import { ComponentProps } from "react";
import clsx from "clsx";
import { label, type LabelProps } from "@/shared/style/variants";

type Props = ComponentProps<"span"> & LabelProps;

/** 토핑·종류 등 알록달록 태그/뱃지. fill: primary/secondary/assistive/gray/pink/yellow. */
export default function Tag({
  fill = "secondary",
  size = "small",
  className,
  ...rest
}: Props) {
  return (
    <span className={clsx(label({ fill, size }), className)} {...rest} />
  );
}
