import clsx from "clsx";
import React, { useImperativeHandle, useRef } from "react";
import { typo } from "@/shared/style/variants";

type InputBaseProp = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "ref" | "type" | "className"
> & {
  type: "text" | "number";
  fontSize?: "body1" | "body3";
};

export const InputHead = (
  props: InputBaseProp & { ref?: React.Ref<HTMLInputElement> },
) => {
  const { placeholder, fontSize, ...rest } = props;
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(props.ref, () => internalRef.current as HTMLInputElement);

  return (
    <div className="relative w-full">
      <input
        ref={internalRef}
        placeholder={" "}
        className={clsx(
          "peer relative w-full text-3xl font-medium text-gray-700 z-[1] caret-primary-600",
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0",
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
          fontSize && typo({ size: fontSize }),
        )}
        {...rest}
      />
      <span
        style={{ ...rest.style }}
        data-hide={(props?.value as string)?.length > 0}
        className={clsx(
          "absolute left-0 top-0 text-3xl font-medium text-gray-400 transition-all duration-[0.25s]",
          "peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2",
          "data-[hide=true]:opacity-0 data-[hide=true]:-translate-y-1/2",
          fontSize && typo({ size: fontSize }),
        )}
      >
        {placeholder ?? "입력해 주세요"}
      </span>
    </div>
  );
};
