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
      riceKinds: [],
      sauceKinds: [],
      spiciness: null,
      sideMenus: [],
      noodleKinds: [],
      others: [],
      recommend: [],
      myComment: "",
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
