import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/shared/lib/cn";
import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { TextGroupField as TextGroupFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import Icons from "@/shared/ui/Icons";
import { buttons, label } from "@/shared/style/variants";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

type Props = TextGroupFieldDef & { status: FieldStatus };

const SUGGESTED_KEYWORDS = ["시장떡볶이", "학교앞분식", "수제튀김", "수제어묵"];

export const TextGroupField = ({
  status,
  title,
  detailTitle,
  name,
  placeholder,
}: Props) => {
  const { control, setValue } = useFormContext<RestaurantFormData>();
  const values = (useWatch({ control, name }) ?? []) as string[];
  const [input, setInput] = useState("");

  const addValue = (value: string) => {
    if (!value) return;
    setValue(name, [...values, value]);
    setInput("");
  };
  const removeValue = (value: string) => {
    setValue(
      name,
      values.filter((item) => item !== value),
    );
  };

  return (
    <FieldShell
      title={title}
      detailTitle={detailTitle}
      status={status}
      foldedValue={values.join(", ") || "선택되지 않음"}
    >
      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full flex">
          <div className="relative w-full">
            <input
              type="text"
              inputMode="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="relative w-full text-2xl font-medium text-gray-700 z-1 caret-primary-600"
            />
            <span
              data-hide={input.length > 0}
              className="absolute left-0 top-0 text-2xl font-medium text-gray-400 transition-all duration-[0.25s] data-[hide=true]:opacity-0 data-[hide=true]:-translate-y-1/2"
            >
              {placeholder}
            </span>
          </div>
          <button
            type="button"
            className={cn(
              buttons({ fill: "secondary", size: "small" }),
              "border-primary-700/40",
            )}
            onClick={() => addValue(input)}
          >
            추가
          </button>
        </div>

        <div className="flex gap-2 items-center justify-center">
          {values.map((value) => (
            <span
              key={value}
              className={label({ fill: "secondary", size: "small" })}
              onClick={() => removeValue(value)}
            >
              {value}
              <Icons w="bold" t="round" name="cross" size={12} />
            </span>
          ))}
        </div>

        <div className="flex flex-col items-start gap-1">
          <p className="text-sm font-medium">혹시 이런 키워드는 어떠세요?</p>
          <div className="flex gap-1.5 items-center justify-center">
            {SUGGESTED_KEYWORDS.map((item) => (
              <button
                type="button"
                key={item}
                className={label({ fill: "assistive", size: "small" })}
                onClick={() => setInput(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FieldShell>
  );
};
