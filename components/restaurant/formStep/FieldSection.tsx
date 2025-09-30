import clsx from "clsx";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { RestaurantFormData } from "@/components/restaurant/RestaurantForm";
import { PlaceField } from "@/components/restaurant/formStep/place-fields";
import { SelectBox } from "@/share/components/SelectBox";
import { formStyle } from "@/components/restaurant/formStep/form.css";
import { flexRatio, flexs, fullwidth } from "@/style/container.css";
import Icons from "@/share/components/Icons";
import { align, fonts } from "@/style/typo.css";
import { inputStyle } from "@/share/components/css/input.css";
import { theme } from "@/style/theme.css";
import { buttons, label, mainButton } from "@/share/components/css/share.css";

type FieldStatus = "fold-value" | "fold" | "unfold";
interface TitleProps {
  title: string;
  detailTitle: string;
  status: FieldStatus;
}
const FieldTitle = (props: TitleProps) => {
  return (
    <div className={formStyle.fieldTitleBox}>
      <h4
        className={clsx(fonts.body3.medium, formStyle.fieldTitle)}
        data-visible={props.status !== "unfold"}
      >
        {props.title}
      </h4>
      <h4
        className={clsx(
          fonts.head6.semibold,
          formStyle.fieldTitle,
          formStyle.fieldDetailTitle,
        )}
        data-visible={props.status === "unfold"}
      >
        {props.detailTitle}
      </h4>
    </div>
  );
};
export const FieldSection = (props: PlaceField & { status?: FieldStatus }) => {
  const {
    status = "unfold",
    title,
    detailTitle,
    name,
    type,
    items,
    placeholder,
    number,
    subField,
  } = props;
  const { register, watch, setValue } = useFormContext<RestaurantFormData>();
  const textGroupInputRef = useRef<HTMLInputElement>(null);

  if (type === "checkbox" || type === "radio") {
    return (
      <div className={formStyle.fieldContainer} data-fold={status !== "unfold"}>
        <FieldTitle title={title} detailTitle={detailTitle} status={status} />
        <div
          className={clsx(fullwidth, {
            [flexs({ gap: "8", align: "stretch" })]: (items?.length ?? 0) < 5,
            [formStyle.selectListGrid]: (items?.length ?? 0) >= 5,
          })}
          style={{ display: status !== "unfold" ? "none" : undefined }}
        >
          {items?.map((item) => (
            <SelectBox
              key={item.value}
              type={type}
              title={item.label}
              value={item.value}
              description={item.description!}
              icon={item?.icon}
              {...register(name)}
            />
          ))}
        </div>
        <div className={formStyle.fieldValue} data-hide={status === "unfold"}>
          {type === "radio" &&
            (items?.find((item) => item.value === watch(name))?.label ?? "")}
          {type === "checkbox" &&
            (items
              ?.filter((item) => watch(name).includes(item.value))
              .map((item) => item.label)
              .join(", ") ??
              "")}
        </div>
      </div>
    );
  }

  if (type === "number" || type === "text") {
    return (
      <div className={formStyle.fieldContainer} data-fold={status !== "unfold"}>
        <FieldTitle title={title} detailTitle={detailTitle} status={status} />
        <div
          className={clsx(fullwidth, inputStyle.container)}
          style={{ display: status !== "unfold" ? "none" : undefined }}
        >
          <input
            type={type}
            inputMode={type === "number" ? "numeric" : "text"}
            autoFocus={true}
            className={inputStyle.input}
            {...register(name, {
              valueAsNumber: type === "number",
              onChange: (e) => {
                if (type === "number") {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                } else {
                  return;
                }
              },
            })}
          />
          <span
            className={inputStyle.inputPlaceholder}
            data-hide={
              type === "number"
                ? Number(watch(name)) > 0
                : watch(name).length > 0
            }
          >
            {placeholder}
          </span>
        </div>
        <div className={formStyle.fieldValue} data-hide={status === "unfold"}>
          {type === "text" && (watch(name) ?? "선택되지 않음")}
          {type === "number" &&
            (Number.isNaN(Number(watch(name))) ? "--" : watch(name))}
        </div>
      </div>
    );
  }

  if (type === "spicy-range") {
    return (
      <div className={formStyle.fieldContainer} data-fold={status !== "unfold"}>
        <FieldTitle title={title} detailTitle={detailTitle} status={status} />
        <div
          className={clsx(fullwidth, flexs({ dir: "col", gap: "16" }))}
          style={{ display: status !== "unfold" ? "none" : undefined }}
        >
          <div className={clsx(fullwidth, flexs({ dir: "col" }))}>
            <div className={formStyle.pepperItems}>
              <span className={formStyle.spicyLabel}></span>
              <span className={formStyle.spicyLabel}>외국인도{"\n"}누구나</span>
              <span className={formStyle.spicyLabel}>진라면</span>
              <span className={formStyle.spicyLabel}>신라면</span>
              <span className={formStyle.spicyLabel}></span>
              <span className={formStyle.spicyLabel}>불닭</span>
              <span className={formStyle.spicyLabel}>불닭보다{"\n"}매워요</span>
              <span className={formStyle.spicyLabel}></span>
            </div>
            <div className={formStyle.pepperItems}>
              <div className={flexRatio["1"]}>
                <Icons w="regular" t="round" name="pepper" size={20} />
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={0} {...register(name)} />
                  <span>0</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={1} {...register(name)} />
                  <span>1</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={2} {...register(name)} />
                  <span>2</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={3} {...register(name)} />
                  <span>3</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={4} {...register(name)} />
                  <span>4</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <label className={formStyle.pepperItem}>
                  <input type="radio" value={5} {...register(name)} />
                  <span>5</span>
                </label>
              </div>
              <div className={flexRatio["1"]}>
                <Icons w="solid" t="round" name="pepper-hot" size={20} />
              </div>
            </div>
          </div>
          {subField && (
            <label
              htmlFor={subField.name}
              className={formStyle.spicyChangeLabel}
            >
              <Icons
                w={watch(subField.name) ? "solid" : "regular"}
                name={watch(subField.name) ? "checkbox" : "square"}
                t="round"
                size={18}
                color={
                  watch(subField.name)
                    ? theme.color.primary["600"]
                    : theme.color.gray["400"]
                }
              />
              <span>맵기를 선택(조절)할 수 있는 가게</span>
              <input
                type={subField.type}
                id={subField.name}
                style={{ display: "none" }}
                {...register(subField.name)}
              />
            </label>
          )}
        </div>
        <div className={formStyle.fieldValue} data-hide={status === "unfold"}>
          {watch(name) ? `${watch(name)}단계 수준` : ""}
        </div>
      </div>
    );
  }

  if (type === "text-group") {
    const addFieldValue = (value: string) => {
      setValue(name, [
        ...((watch(name) as string[]) ?? []),
        textGroupInputRef.current!.value,
      ]);
      setTimeout(() => {
        textGroupInputRef.current!.value = "";
      }, 1);
    };

    return (
      <div className={formStyle.fieldContainer} data-fold={status !== "unfold"}>
        <FieldTitle title={title} detailTitle={detailTitle} status={status} />
        <div
          className={clsx(
            fullwidth,
            flexs({ dir: "col", align: "start", gap: "16" }),
          )}
          style={{ display: status !== "unfold" ? "none" : undefined }}
        >
          {JSON.stringify(watch(name))}
          <div className={clsx(fullwidth, flexs({}))}>
            <div className={clsx(fullwidth, inputStyle.container)}>
              <input
                ref={textGroupInputRef}
                type={type}
                inputMode="text"
                autoFocus={true}
                className={clsx(inputStyle.input, fonts.head6.medium)}
              />
              <span
                className={clsx(
                  inputStyle.inputPlaceholder,
                  fonts.head6.medium,
                )}
                data-hide={watch(name).length > 0}
              >
                {placeholder}
              </span>
            </div>
            <button
              type="button"
              className={buttons({
                fill: "secondary",
                size: "small",
              })}
              data-fill="secondary"
              onClick={() => {
                setValue(name, [
                  ...((watch(name) as string[]) ?? []),
                  textGroupInputRef.current!.value,
                ]);
                setTimeout(() => {
                  textGroupInputRef.current!.value = "";
                }, 1);
              }}
            >
              추가
            </button>
          </div>
          <div className={flexs({ dir: "col", align: "start", gap: "4" })}>
            <p className={fonts.body4.medium}>혹시 이런 키워드는 어떠세요?</p>
            <div className={flexs({ gap: "6" })}>
              {["시장떡볶이", "학교앞분식", "수제튀김"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={label({ fill: "secondary", size: "small" })}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={formStyle.fieldValue} data-hide={status === "unfold"}>
          {watch(name) ?? "선택되지 않음"}
        </div>
      </div>
    );
  }
  if (type === "textarea") {
    return (
      <div className={formStyle.fieldContainer} data-fold={status !== "unfold"}>
        <FieldTitle title={title} detailTitle={detailTitle} status={status} />
        <div
          className={clsx(fullwidth, inputStyle.container)}
          style={{ display: status !== "unfold" ? "none" : undefined }}
        >
          <textarea
            className={clsx(fullwidth, inputStyle.textarea)}
            maxLength={number}
            {...register(name)}
          />
          <span
            className={inputStyle.textareaPlaceholder}
            data-hide={watch(name).length > 0}
          >
            {placeholder}
          </span>
          <p className={clsx(fonts.body4.regular, align.right)}>
            {watch(name).length}/{number}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
