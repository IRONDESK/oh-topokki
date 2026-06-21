import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { TextareaField as TextareaFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import { fullwidth } from "@/shared/style/container.css";
import { inputStyle } from "@/shared/ui/css/input.css";
import { align, fonts } from "@/shared/style/typo.css";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

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
      <div className={clsx(fullwidth, inputStyle.container)}>
        <textarea
          className={clsx(fullwidth, inputStyle.textarea)}
          maxLength={maxLength}
          {...register(name)}
        />
        <span
          className={inputStyle.textareaPlaceholder}
          data-hide={value.length > 0}
        >
          {placeholder}
        </span>
        <p className={clsx(fonts.body4.regular, align.right)}>
          {value.length}/{maxLength}
        </p>
      </div>
    </FieldShell>
  );
};
