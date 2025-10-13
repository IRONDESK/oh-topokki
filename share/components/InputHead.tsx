import React, { useImperativeHandle, useRef } from "react";
import { formStyle } from "@/components/restaurant/formStep/form.css";
import { inputStyle } from "@/share/components/css/input.css";

type InputBaseProp = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "ref" | "type" | "className"
> & {
  type: "text" | "number";
};

export const InputHead = (
  props: InputBaseProp & { ref?: React.Ref<HTMLInputElement> },
) => {
  const { placeholder, ...rest } = props;
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(props.ref, () => internalRef.current as HTMLInputElement);

  return (
    <div className={inputStyle.container}>
      <input
        ref={internalRef}
        placeholder={" "}
        className={inputStyle.inputCssHiding}
        {...rest}
      />
      <span
        className={inputStyle.inputPlaceholder}
        style={{ ...rest.style }}
        data-hide={(props?.value as string)?.length > 0}
      >
        {placeholder ?? "입력해 주세요"}
      </span>
    </div>
  );
};
