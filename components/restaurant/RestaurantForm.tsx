"use client";

import { useState, ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { type OverlayControllerComponent, } from 'overlay-kit';
import { useAuth } from "@/contexts/AuthContext";

import * as styles from "./RestaurantForm.css";
import Icons from "@/share/components/Icons";
import { RestaurantFormProvider } from "./RestaurantFormProvider";
import PlaceSearchForm from "./formStep/PlaceSearchForm";
import RestaurantDetailForm from "./formStep/RestaurantDetailForm";
import { formStyle } from "@/components/restaurant/formStep/form.css";

export interface RestaurantFormData {
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
}

const RestaurantFormContent = ({ close }: Partial<ComponentProps<OverlayControllerComponent>>) => {
  const { user } = useAuth();
  const { reset, handleSubmit } = useFormContext<RestaurantFormData>();
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    setSearchQuery("");
    setSearchResults([]);
    close();
    reset();
  };

  const onSubmit = async (data: RestaurantFormData) => {
    if (!data.name || !data.address) {
      alert("가게 이름과 주소는 필수입니다.");
      return;
    }

    try {
      setSubmitting(true);
      handleClose();
    } catch (error) {
      console.error("맛집 등록 오류:", error);
      alert("맛집 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="창 닫기"
        >
          <Icons w="regular" t="straight" name="cross" size={20} />
        </button>
      </div>

      <form className={styles.content} onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <h3 className={formStyle.formTitle}>
            {user?.user_metadata.name}님의
            <br />
            떡볶이 맛집은 어디인가요?
          </h3>
        )}
        {step === 1 ? (
          <PlaceSearchForm
            setStep={setStep}
          />
        ) : (
          <RestaurantDetailForm
            setStep={setStep}
          />
        )}
      </form>
    </div>
  );
};

const RestaurantRegisterForm = (controller: ComponentProps<OverlayControllerComponent>) => {
  if (!isOpen) return null;

  return (
    <RestaurantFormProvider>
      <div className={styles.overlay}>
        <RestaurantFormContent close={controller.close} />
      </div>
    </RestaurantFormProvider>
  );
};

export default RestaurantRegisterForm;
