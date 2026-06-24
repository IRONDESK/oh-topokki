import React, { useImperativeHandle, useRef } from "react";

interface SelectBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref" | "style"> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const SelectBox = (
  props: SelectBoxProps & { ref?: React.Ref<HTMLInputElement> },
) => {
  const { title, description, icon, ...rest } = props;
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(props.ref, () => internalRef.current as HTMLInputElement);

  return (
    <label className="relative flex justify-center items-stretch cursor-pointer w-full border-[1.5px] border-gray-200 rounded-lg p-3 break-keep text-center transition-colors has-[input:checked]:bg-primary-50 has-[input:checked]:border-primary-400 has-[input:checked]:text-primary-700">
      {icon}
      <div className="w-full flex flex-col items-center justify-center gap-0.5">
        <span className="text-base font-medium">{title}</span>
        <span className="text-xs font-normal">{description}</span>
      </div>
      <input
        ref={internalRef}
        readOnly={true}
        style={{ display: "none" }}
        {...rest}
      />
    </label>
  );
};
