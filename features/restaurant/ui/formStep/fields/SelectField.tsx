import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import {
  CheckboxField,
  RadioField,
} from "@/features/restaurant/ui/formStep/place-fields";
import { SelectBox } from "@/shared/ui/SelectBox";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

type Props = (RadioField | CheckboxField) & { status: FieldStatus };

export const SelectField = ({
  status,
  title,
  detailTitle,
  name,
  type,
  items,
}: Props) => {
  const { register, control } = useFormContext<RestaurantFormData>();
  const value = useWatch({ control, name });

  const foldedValue =
    type === "radio"
      ? (items.find((item) => item.value === value)?.label ?? "")
      : items
          .filter((item) => (value as string[])?.includes(item.value))
          .map((item) => item.label)
          .join(", ");

  return (
    <FieldShell
      title={title}
      detailTitle={detailTitle}
      status={status}
      foldedValue={foldedValue}
    >
      <div
        className={clsx(
          "w-full",
          items.length < 5
            ? "flex gap-2 items-stretch"
            : "grid grid-cols-3 gap-2",
        )}
      >
        {items.map((item) => (
          <SelectBox
            key={item.value}
            type={type}
            title={item.label}
            value={item.value}
            description={item.description!}
            icon={item.icon}
            {...register(name)}
          />
        ))}
      </div>
    </FieldShell>
  );
};
