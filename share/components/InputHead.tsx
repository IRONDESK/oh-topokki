import clsx from "clsx";
import React, { useImperativeHandle, useRef } from "react";
import { inputStyle } from "@/share/components/css/input.css";
import { typo } from "@/style/typo.css";

type InputBaseProp = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "ref" | "type" | "className"
> & {
  type: "text" | "number";
  small?: boolean;
};

export const InputHead = (
  props: InputBaseProp & { ref?: React.Ref<HTMLInputElement> },
) => {
  const { placeholder, small = false, ...rest } = props;
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(props.ref, () => internalRef.current as HTMLInputElement);

  return (
    <div className={inputStyle.container}>
      <input
        ref={internalRef}
        placeholder={" "}
        className={clsx(
          inputStyle.inputCssHiding,
          small &&
            typo({
              size: "body1",
            }),
        )}
        {...rest}
      />
      <span
        className={clsx(
          inputStyle.inputPlaceholder,
          small &&
            typo({
              size: "body1",
            }),
        )}
        style={{ ...rest.style }}
        data-hide={(props?.value as string)?.length > 0}
      >
        {placeholder ?? "입력해 주세요"}
      </span>
    </div>
  );
};
