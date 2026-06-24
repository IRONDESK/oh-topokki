import React, { useImperativeHandle, useRef, useState } from "react";
import Icons from "@/shared/ui/Icons";
import {
  useFloating,
  hide,
  flip,
  offset,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

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
      ref={refs.setReference}
      onClick={() => setOpen((prev) => !prev)}
      className="relative flex justify-center items-stretch cursor-pointer w-full border-[1.5px] border-gray-200 rounded-lg p-3 break-keep text-center"
    >
      <div
        data-placeholder={displayValue === null}
        className="flex flex-1 gap-1 justify-between items-center text-base font-normal data-[placeholder=true]:text-gray-500"
      >
        {displayValue ?? placeholder ?? "선택해 주세요"}
        <Icons w="regular" t="round" name="angle-small-down" size={24} />
      </div>
      <input
        ref={internalRef}
        readOnly={true}
        style={{ display: "none" }}
        {...rest}
      />
      {open && (
        <ul
          ref={refs.setFloating}
          role="dialog"
          style={{ ...floatingStyles, zIndex: 10 }}
          className="select-none flex flex-col w-full py-2.5 border-[1.5px] border-ink rounded-lg bg-white shadow-sticker"
          {...getFloatingProps()}
        >
          {items.map((item) => (
            <li
              key={item.value}
              onClick={() => updateInputValue(item.value, item.label)}
              data-active={displayValue === item.label}
              className="text-base font-normal px-4 py-2.5 hover:bg-primary-50 active:bg-primary-100 data-[active=true]:bg-primary-50 data-[active=true]:text-primary-700"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
