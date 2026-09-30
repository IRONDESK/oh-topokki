"use client";

import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RestaurantFormData } from "@/shared/api/model/restaurant";

interface RestaurantFormProviderProps {
  children: ReactNode;
  // 수정 모드에서 기존 식당 값을 채워 넣을 때 사용
  defaultValues?: Partial<RestaurantFormData>;
}

export const RestaurantFormProvider = ({
  children,
  defaultValues,
}: RestaurantFormProviderProps) => {
  const methods = useForm<RestaurantFormData>({
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      phoneNumber: "",
      topokkiType: "",
      price: 0,
      priceServings: "1",
      riceTypes: [],
      sauceTypes: [],
      spiciness: null,
      canChangeSpicy: false,
      sideMenus: [],
      noodleTypes: [],
      sundaeType: "",
      others: [],
      recommend: [],
      myComment: "",
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
