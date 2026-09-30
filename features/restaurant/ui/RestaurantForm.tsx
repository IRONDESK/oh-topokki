"use client";

import { useState, ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { type OverlayControllerComponent } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";

import { RestaurantFormProvider } from "./RestaurantFormProvider";
import PlaceSearchForm from "./formStep/PlaceSearchForm";
import RestaurantDetailForm from "./formStep/RestaurantDetailForm";
import { Modal } from "@/shared/ui/Modal";
import {
  RestaurantFormData,
  ResponseRestaurant,
} from "@/shared/api/model/restaurant";


type FormProps = ComponentProps<OverlayControllerComponent> & {
  // 있으면 수정 모드: 기존 값이 채워진 상태로 상세 스텝부터 시작
  restaurant?: ResponseRestaurant;
};

const RestaurantFormContent = (props: FormProps) => {
  const { close, restaurant, ...rest } = props;
  const { user } = useAuth();
  const { reset } = useFormContext<RestaurantFormData>();
  const [step, setStep] = useState(restaurant ? 2 : 1);

  const handleClose = () => {
    setStep(restaurant ? 2 : 1);
    close();
    reset();
  };

  return (
    <Modal close={handleClose} {...rest}>
      {step === 1 && (
        <h3 className="text-3xl font-semibold mt-8 mb-[26px]">
          {user?.nickname}님의
          <br />
          떡볶이 맛집은 어디인가요?
        </h3>
      )}
      {step === 1 ? (
        <PlaceSearchForm setStep={setStep} />
      ) : (
        <RestaurantDetailForm
          setStep={setStep}
          restaurantId={restaurant?.id}
          onComplete={handleClose}
        />
      )}
    </Modal>
  );
};

// ResponseRestaurant → 폼 초기값 (null 필드는 폼 기본 형태로 정규화)
const toFormValues = (r: ResponseRestaurant): Partial<RestaurantFormData> => ({
  name: r.name,
  address: r.address,
  latitude: r.latitude,
  longitude: r.longitude,
  phoneNumber: r.phoneNumber ?? "",
  topokkiType: r.topokkiType ?? "",
  price: r.price ?? 0,
  priceServings: String(r.priceServings ?? 1),
  riceTypes: r.riceTypes,
  sauceTypes: r.sauceTypes,
  spiciness: r.spiciness ?? null,
  canChangeSpicy: r.canChangeSpicy,
  sideMenus: r.sideMenus,
  noodleTypes: r.noodleTypes,
  sundaeType: r.sundaeType ?? "",
  others: r.others,
  recommend: r.recommend,
});

const RestaurantRegisterForm = (props: FormProps) => {
  if (!props.isOpen) return null;

  return (
    <RestaurantFormProvider
      defaultValues={props.restaurant ? toFormValues(props.restaurant) : undefined}
    >
      <RestaurantFormContent {...props} />
    </RestaurantFormProvider>
  );
};

export default RestaurantRegisterForm;
