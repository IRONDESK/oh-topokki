"use client";

import { useState, ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { type OverlayControllerComponent } from "overlay-kit";
import { useAuth } from "@/contexts/AuthContext";

import { RestaurantFormProvider } from "./RestaurantFormProvider";
import PlaceSearchForm from "./formStep/PlaceSearchForm";
import RestaurantDetailForm from "./formStep/RestaurantDetailForm";
import { formStyle } from "@/components/restaurant/formStep/form.css";
import { Modal } from "@/share/components/Modal";

export type RestaurantFormData = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  topokkiType?: string;
  price?: number;
  riceKinds: string[];
  sauceKinds: string[];
  spiciness?: number | null;
  sideMenus: Array<{ name: string }>;
  noodleKinds: string[];
  sundaeType?: string;
  others: Array<{ name: string }>;
  recommend: Array<{ type: string; url: string }>;
  myComment?: string;
};

const RestaurantFormContent = (
  controller: ComponentProps<OverlayControllerComponent>,
) => {
  const { close, ...rest } = controller;
  const { user } = useAuth();
  const { reset } = useFormContext<RestaurantFormData>();
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    close();
    reset();
  };

  return (
    <Modal close={handleClose} {...rest}>
      {step === 1 && (
        <h3 className={formStyle.formTitle}>
          {user?.user_metadata.name}님의
          <br />
          떡볶이 맛집은 어디인가요?
        </h3>
      )}
      {step === 1 ? (
        <PlaceSearchForm setStep={setStep} />
      ) : (
        <RestaurantDetailForm setStep={setStep} />
      )}
    </Modal>
  );
};

const RestaurantRegisterForm = (
  controller: ComponentProps<OverlayControllerComponent>,
) => {
  if (!controller.isOpen) return null;

  return (
    <RestaurantFormProvider>
      <RestaurantFormContent {...controller} />
    </RestaurantFormProvider>
  );
};

export default RestaurantRegisterForm;
