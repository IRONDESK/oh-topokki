import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import {
  NumberField,
  TextField as TextFieldDef,
} from "@/features/restaurant/ui/formStep/place-fields";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

const INPUT_CLS =
  "relative w-full text-3xl font-medium text-gray-700 z-[1] caret-primary-600 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0";
const PLACEHOLDER_CLS =
  "absolute left-0 top-0 text-3xl font-medium text-gray-400 transition-all duration-[0.25s] data-[hide=true]:opacity-0 data-[hide=true]:-translate-y-1/2";

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
      <div className="relative w-full">
        <input
          type={type}
          inputMode={isNumber ? "numeric" : "text"}
          autoFocus
          className={INPUT_CLS}
          {...register(name, {
            valueAsNumber: isNumber,
            onChange: (e) => {
              if (isNumber) {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }
            },
          })}
        />
        <span className={PLACEHOLDER_CLS} data-hide={!isEmpty}>
          {placeholder}
        </span>
      </div>
    </FieldShell>
  );
};
