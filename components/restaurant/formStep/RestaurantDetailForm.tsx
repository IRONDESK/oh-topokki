"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { josa } from "es-hangul";

import * as styles from "../RestaurantForm.css";
import { RestaurantFormData } from "../RestaurantForm";
import { fixedBottom, flexs } from "@/style/container.css";
import { fonts } from "@/style/typo.css";
import Icons from "@/share/components/Icons";
import { placeFields } from "@/components/restaurant/formStep/place-fields";
import { FieldSection } from "@/components/restaurant/formStep/FieldSection";
import { Text } from "@/share/components/Text";
import { mainButton } from "@/share/components/css/share.css";
import { usePostRestaurantInfo } from "@/share/hooks/naver-map";
import { overlay } from "@/share/components/feature/overlay";

type Props = {
  setStep: (step: number) => void;
};

const RestaurantDetailForm = ({ setStep }: Props) => {
  const [order, setOrder] = useState(0);
  const { watch, handleSubmit } = useFormContext<RestaurantFormData>();
  const formData = watch();
  const { mutate, isPending } = usePostRestaurantInfo();

  const onSubmit = (data: RestaurantFormData) => {
    mutate(data, {
      onSuccess: async () => {
        overlay.alert({ title: "새 맛집을 등록했어요" });
      },
      onError: async (error) => {
        overlay.alert({ title: "등록에 실패했어요", contents: error.message });
      },
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={flexs({ justify: "spb", align: "start" })}>
        <div>
          <p className={fonts.head5.medium}>
            <Text color="primary-500">{formData.name}</Text>
            {josa(formData.name, "은/는").slice(-1)}
            <br />
            어떤 맛집인가요?
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className={styles.backBtn}
        >
          <Icons w="regular" name="refresh" size={14} /> 다시 선택
        </button>
      </div>

      <ul>
        {placeFields.map((field, index) => {
          const isPrevStatus = index < order ? "fold-value" : "fold";
          return (
            <li
              key={field.name}
              className={styles.fieldWrapper}
              data-show={order === index}
            >
              <FieldSection
                status={order === index ? "unfold" : isPrevStatus}
                {...field}
              />
            </li>
          );
        })}
      </ul>

      <div className={fixedBottom}>
        {order > 0 && (
          <button
            type="button"
            className={mainButton}
            data-fill="secondary"
            onClick={() => setOrder((prev) => prev - 1)}
          >
            이전
          </button>
        )}
        {order === placeFields.length - 1 && (
          <button type="submit" disabled={isPending} className={mainButton}>
            {isPending ? "등록 중..." : "등록하기"}
          </button>
        )}
        {order < placeFields.length - 1 && (
          <button
            type="button"
            className={mainButton}
            onClick={() => setOrder((prev) => prev + 1)}
          >
            다음
          </button>
        )}
      </div>
    </form>
  );
};

export default RestaurantDetailForm;
