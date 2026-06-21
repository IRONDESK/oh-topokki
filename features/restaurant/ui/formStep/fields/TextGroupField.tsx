import clsx from "clsx";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { TextGroupField as TextGroupFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import { flexs, fullwidth } from "@/shared/style/container.css";
import Icons from "@/shared/ui/Icons";
import { fonts } from "@/shared/style/typo.css";
import { inputStyle } from "@/shared/ui/css/input.css";
import { buttons, label } from "@/shared/ui/css/share.css";
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
      <div
        className={clsx(
          fullwidth,
          flexs({ dir: "col", align: "start", gap: "16" }),
        )}
      >
        <div className={clsx(fullwidth, flexs({}))}>
          <div className={clsx(fullwidth, inputStyle.container)}>
            <input
              type="text"
              inputMode="text"
              autoFocus
              className={clsx(inputStyle.input, fonts.head6.medium)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <span
              className={clsx(inputStyle.inputPlaceholder, fonts.head6.medium)}
              data-hide={input.length > 0}
            >
              {placeholder}
            </span>
          </div>
          <button
            type="button"
            className={buttons({ fill: "secondary", size: "small" })}
            data-fill="secondary"
            onClick={() => addValue(input)}
          >
            추가
          </button>
        </div>

        <div className={flexs({ gap: "8" })}>
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

        <div className={flexs({ dir: "col", align: "start", gap: "4" })}>
          <p className={fonts.body4.medium}>혹시 이런 키워드는 어떠세요?</p>
          <div className={flexs({ gap: "6" })}>
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
