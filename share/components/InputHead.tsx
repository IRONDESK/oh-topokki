import clsx from "clsx";
import React, { useImperativeHandle, useRef } from "react";
import { inputStyle } from "@/share/components/css/input.css";
import { typo } from "@/style/typo.css";

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
    <div className={inputStyle.container}>
      <input
        ref={internalRef}
        placeholder={" "}
        className={clsx(
          inputStyle.inputCssHiding,
          fontSize && typo({ size: fontSize }),
        )}
        {...rest}
      />
      <span
        className={clsx(
          inputStyle.inputPlaceholder,
          fontSize && typo({ size: fontSize }),
        )}
        style={{ ...rest.style }}
        data-hide={(props?.value as string)?.length > 0}
      >
        {placeholder ?? "입력해 주세요"}
      </span>
    </div>
  );
};
