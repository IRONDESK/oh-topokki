"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { josa } from "es-hangul";
import { useRouter } from "next/navigation";

import { RestaurantFormData } from "../RestaurantForm";
import Icons from "@/shared/ui/Icons";
import { placeFields } from "@/features/restaurant/ui/formStep/place-fields";
import { FieldSection } from "@/features/restaurant/ui/formStep/FieldSection";
import { Text } from "@/shared/ui/Text";
import { fixedBottom, mainButton } from "@/shared/style/variants";
import {
  useCreateRestaurant,
  useUpdateRestaurant,
} from "@/features/restaurant/api/use-restaurant";
import { dialog } from "@/shared/ui/feature/dialog";

type Props = {
  setStep: (step: number) => void;
  // 있으면 수정 모드로 동작 (등록 대신 PUT)
  restaurantId?: string;
  onComplete?: () => void;
};

const RestaurantDetailForm = ({ setStep, restaurantId, onComplete }: Props) => {
  const [order, setOrder] = useState(0);
  const { watch, handleSubmit } = useFormContext<RestaurantFormData>();
  const formData = watch();
  const { mutate, isPending } = useCreateRestaurant();
  const { mutate: update, isPending: isUpdatePending } = useUpdateRestaurant();
  const router = useRouter();

  const isEdit = !!restaurantId;
  const isSaving = isPending || isUpdatePending;
  // "나의 한마디"는 등록 시 첫 리뷰를 만드는 필드라 수정 모드에서는 제외
  const fields = isEdit
    ? placeFields.filter((f) => f.name !== "myComment")
    : placeFields;

  const onSubmit = (data: RestaurantFormData) => {
    if (isEdit) {
      update(
        { restaurantId, json: data },
        {
          onSuccess: async () => {
            await dialog.alert({ title: "맛집 정보를 수정했어요" });
            onComplete?.();
          },
          onError: async (error) => {
            dialog.alert({
              title: "수정에 실패했어요",
              contents: error.message,
            });
          },
        },
      );
      return;
    }

    mutate(data, {
      onSuccess: async (restaurant) => {
        await dialog.alert({ title: "새 맛집을 등록했어요" });
        router.replace(`/?restaurant=${restaurant.id}`);
      },
      onError: async (error) => {
        dialog.alert({ title: "등록에 실패했어요", contents: error.message });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 w-full pb-[calc(env(safe-area-inset-bottom,0)+88px)]"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-3xl font-medium">
            <Text color="primary-500">{formData.name}</Text>
            {josa(formData.name, "은/는").slice(-1)}
            <br />
            어떤 맛집인가요?
          </p>
        </div>
        {!isEdit && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="shrink-0 cursor-pointer bg-gray-100 rounded-full px-3.5 py-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 flex gap-1.5 items-center text-sm font-medium"
          >
            <Icons w="regular" name="refresh" size={14} /> 다시 선택
          </button>
        )}
      </div>

      <ul>
        {fields.map((field, index) => {
          const isPrevStatus = index < order ? "fold-value" : "fold";
          return (
            <li
              key={field.name}
              data-show={order === index}
              className="-mx-5 px-5 data-[show=true]:shadow-xl"
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
        {order === fields.length - 1 && (
          <button type="submit" disabled={isSaving} className={mainButton}>
            {isSaving
              ? isEdit
                ? "수정 중..."
                : "등록 중..."
              : isEdit
                ? "수정하기"
                : "등록하기"}
          </button>
        )}
        {order < fields.length - 1 && (
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
