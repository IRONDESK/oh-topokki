import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { TextareaField as TextareaFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

const TEXTAREA_CLS =
  "relative w-full text-2xl font-normal text-gray-700 z-[1] caret-primary-600";
const PLACEHOLDER_CLS =
  "absolute left-0 top-0 text-2xl font-normal text-gray-400 transition-all duration-[0.25s] data-[hide=true]:opacity-0 data-[hide=true]:-translate-y-1/2";

type Props = TextareaFieldDef & { status: FieldStatus };

export const TextareaField = ({
  status,
  title,
  detailTitle,
  name,
  placeholder,
  maxLength,
}: Props) => {
  const { register, control } = useFormContext<RestaurantFormData>();
  const value = (useWatch({ control, name }) ?? "") as string;

  return (
    <FieldShell title={title} detailTitle={detailTitle} status={status}>
      <div className="relative w-full">
        <textarea
          className={TEXTAREA_CLS}
          maxLength={maxLength}
          {...register(name)}
        />
        <span className={PLACEHOLDER_CLS} data-hide={value.length > 0}>
          {placeholder}
        </span>
        <p className="text-sm font-normal text-right">
          {value.length}/{maxLength}
        </p>
      </div>
    </FieldShell>
  );
};
