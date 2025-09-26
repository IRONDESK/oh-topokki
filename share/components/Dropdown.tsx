import React, { useImperativeHandle, useRef, useState } from "react";
import { selectStyle } from "@/share/components/css/select.css";
import { fonts } from "@/style/typo.css";
import { flexs } from "@/style/container.css";
import Icons from "@/share/components/Icons";
import {
  useFloating,
  hide,
  flip,
  offset,
  useDismiss,
  OpenChangeReason,
  useInteractions,
} from "@floating-ui/react";
import { Event } from "ws";

interface SelectBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref" | "style"> {
  items: { label: string; value: string }[];
}

export const Dropdown = (
  props: SelectBoxProps & { ref?: React.Ref<HTMLInputElement> },
) => {
  const { placeholder, items, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(
    items.find((item) => item.value === props.value)?.label || null,
  );
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(props.ref, () => internalRef.current as HTMLInputElement);

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open,
    onOpenChange: setOpen,
    middleware: [hide(), flip(), offset(8)],
  });
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const updateInputValue = (value: string, label: string) => {
    setOpen(false);
    internalRef.current!.value = value;
    setDisplayValue(label);
  };

  return (
    <div
      className={selectStyle.label}
      ref={refs.setReference}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className={selectStyle.dropdownBox} data-placeholder={displayValue === null}>
        {displayValue ?? placeholder ?? "선택해 주세요"}
        <Icons w="regular" t="round" name="angle-small-down" size={24} />
      </div>
      <input
        ref={internalRef}
        className={""}
        readOnly={true}
        style={{ display: "none" }}
        {...rest}
      />
      {open && (
        <ul
          ref={refs.setFloating}
          role="dialog"
          className={selectStyle.dropdownItems}
          style={{ ...floatingStyles, zIndex: 10 }}
          {...getFloatingProps()}
        >
          {items.map((item) => (
            <li
              key={item.value}
              className={selectStyle.dropdownItem}
              onClick={() => updateInputValue(item.value, item.label)}
              data-active={displayValue === item.label}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
