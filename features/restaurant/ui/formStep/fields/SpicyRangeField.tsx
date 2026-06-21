import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { SpicyRangeField as SpicyRangeFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import { formStyle } from "@/features/restaurant/ui/formStep/form.css";
import { flexRatio, flexs, fullwidth } from "@/shared/style/container.css";
import Icons from "@/shared/ui/Icons";
import { theme } from "@/shared/style/theme.css";
import {
  FieldShell,
  FieldStatus,
} from "@/features/restaurant/ui/formStep/fields/FieldShell";

type Props = SpicyRangeFieldDef & { status: FieldStatus };

const SPICY_LEVELS = [0, 1, 2, 3, 4, 5];
const SPICY_LABELS = [
  "",
  "외국인도\n누구나",
  "진라면",
  "신라면",
  "신라면\n이상",
  "불닭",
  "불닭보다\n매워요",
  "",
];

export const SpicyRangeField = ({
  status,
  title,
  detailTitle,
  name,
  subField,
}: Props) => {
  const { register, control } = useFormContext<RestaurantFormData>();
  const spiciness = useWatch({ control, name });
  const canChange = useWatch({ control, name: subField.name });

  return (
    <FieldShell
      title={title}
      detailTitle={detailTitle}
      status={status}
      foldedValue={spiciness !== null ? `${spiciness}단계 수준` : ""}
    >
      <div className={clsx(fullwidth, flexs({ dir: "col", gap: "16" }))}>
        <div className={clsx(fullwidth, flexs({ dir: "col" }))}>
          <div className={formStyle.pepperItems}>
            {SPICY_LABELS.map((label, i) => (
              <span key={i} className={formStyle.spicyLabel}>
                {label}
              </span>
            ))}
          </div>
          <div className={formStyle.pepperItems}>
            <div className={flexRatio["1"]}>
              <Icons w="regular" t="round" name="pepper" size={20} />
            </div>
            {SPICY_LEVELS.map((level) => (
              <div key={level} className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={level} {...register(name)} />
                  <span>{level}</span>
                </label>
              </div>
            ))}
            <div className={flexRatio["1"]}>
              <Icons w="solid" t="round" name="pepper-hot" size={20} />
            </div>
          </div>
        </div>

        <label htmlFor={subField.name} className={formStyle.spicyChangeLabel}>
          <Icons
            w={canChange ? "solid" : "regular"}
            name={canChange ? "checkbox" : "square"}
            t="round"
            size={18}
            color={
              canChange ? theme.color.primary["600"] : theme.color.gray["400"]
            }
          />
          <span>맵기를 선택(조절)할 수 있는 가게</span>
          <input
            type="checkbox"
            id={subField.name}
            style={{ display: "none" }}
            {...register(subField.name)}
          />
        </label>
      </div>
    </FieldShell>
  );
};
