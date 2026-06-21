"use client";

import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RestaurantFormData } from "./RestaurantForm";

interface RestaurantFormProviderProps {
  children: ReactNode;
}

export const RestaurantFormProvider = ({
  children,
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
      riceKinds: [],
      sauceKinds: [],
      spiciness: null,
      canChangeSpicy: false,
      sideMenus: [],
      noodleKinds: [],
      sundaeType: "",
      others: [],
      recommend: [],
      myComment: "",
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
