import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import {
  NumberField,
  TextField as TextFieldDef,
} from "@/features/restaurant/ui/formStep/place-fields";
import { fullwidth } from "@/shared/style/container.css";
import { inputStyle } from "@/shared/ui/css/input.css";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

type Props = (TextFieldDef | NumberField) & { status: FieldStatus };

export const TextField = ({
  status,
  title,
  detailTitle,
  name,
  type,
  placeholder,
}: Props) => {
  const { register, control } = useFormContext<RestaurantFormData>();
  const value = useWatch({ control, name });

  const isNumber = type === "number";
  const isEmpty = isNumber
    ? !(Number(value) > 0)
    : ((value as string) ?? "").length === 0;

  const foldedValue = isNumber
    ? Number.isNaN(Number(value))
      ? "--"
      : (value as number)
    : ((value as string) ?? "선택되지 않음");

  return (
    <FieldShell
      title={title}
      detailTitle={detailTitle}
      status={status}
      foldedValue={foldedValue}
    >
      <div className={clsx(fullwidth, inputStyle.container)}>
        <input
          type={type}
          inputMode={isNumber ? "numeric" : "text"}
          autoFocus
          className={inputStyle.input}
          {...register(name, {
            valueAsNumber: isNumber,
            onChange: (e) => {
              if (isNumber) {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }
            },
          })}
        />
        <span className={inputStyle.inputPlaceholder} data-hide={!isEmpty}>
          {placeholder}
        </span>
      </div>
    </FieldShell>
  );
};
