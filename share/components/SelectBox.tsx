import React, { useImperativeHandle, useRef } from "react";
import { selectStyle } from "@/share/components/css/select.css";
import { fonts } from "@/style/typo.css";
import { flexs } from "@/style/container.css";

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
    <label className={selectStyle.label}>
      {icon}
      <div className={flexs({ dir: "col", gap: "2" })}>
        <span className={fonts.body4.medium}>{title}</span>
        <span className={fonts.caption1.regular}>{description}</span>
      </div>
      <input
        ref={internalRef}
        className={""}
        readOnly={true}
        style={{ display: "none" }}
        {...rest}
      />
    </label>
  );
};
