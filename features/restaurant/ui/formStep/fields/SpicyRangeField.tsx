import { useFormContext, useWatch } from "react-hook-form";

import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { SpicyRangeField as SpicyRangeFieldDef } from "@/features/restaurant/ui/formStep/place-fields";
import Icons from "@/shared/ui/Icons";
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

const PEPPER_ROW_CLS =
  "flex justify-between flex-[2] gap-1 w-full text-primary-600 whitespace-pre-wrap text-center";
const SPICY_LABEL_CLS =
  "flex-1 text-sm font-medium text-gray-500 mb-2.5 break-keep";
const PEPPER_ITEM_CLS =
  "flex items-center justify-center mx-auto w-10 h-10 cursor-pointer rounded-full border border-primary-200 text-primary-400 text-xl font-medium has-[input:checked]:text-white has-[input:checked]:bg-primary-500 has-[input:checked]:border-transparent [&>input[type='radio']]:hidden";
const SPICY_CHANGE_LABEL_CLS =
  "select-none cursor-pointer flex w-max mx-auto gap-1.5 items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-base font-medium has-[input:checked]:bg-primary-50 has-[input:checked]:text-primary-600";

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
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col">
          <div className={PEPPER_ROW_CLS}>
            {SPICY_LABELS.map((label, i) => (
              <span key={i} className={SPICY_LABEL_CLS}>
                {label}
              </span>
            ))}
          </div>
          <div className={PEPPER_ROW_CLS}>
            <div className="flex-1">
              <Icons w="regular" t="round" name="pepper" size={20} />
            </div>
            {SPICY_LEVELS.map((level) => (
              <div key={level} className="flex-1">
                <label className={PEPPER_ITEM_CLS}>
                  <input type="radio" value={level} {...register(name)} />
                  <span>{level}</span>
                </label>
              </div>
            ))}
            <div className="flex-1">
              <Icons w="solid" t="round" name="pepper-hot" size={20} />
            </div>
          </div>
        </div>

        <label htmlFor={subField.name} className={SPICY_CHANGE_LABEL_CLS}>
          <Icons
            w={canChange ? "solid" : "regular"}
            name={canChange ? "checkbox" : "square"}
            t="round"
            size={18}
            color={
              canChange
                ? "var(--color-primary-600)"
                : "var(--color-gray-400)"
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
