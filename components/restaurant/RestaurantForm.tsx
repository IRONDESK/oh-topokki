"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Icons from "@/share/components/Icons";
import * as styles from "./RestaurantForm.css";
import { useAuth } from "@/contexts/AuthContext";
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

interface PlaceSearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  telephone: string;
  mapx: string;
  mapy: string;
}

interface RestaurantFormProps {
  isOpen: boolean;
  close: (data: RestaurantFormData) => void;
}

const RestaurantFormContent = ({
  close,
}: {
  close: (data: RestaurantFormData) => void;
}) => {
  const { user } = useAuth();
  const { setValue, getValues, reset } = useFormContext<RestaurantFormData>();

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tempInputs, setTempInputs] = useState({
    rice: "",
    sauce: "",
    sideMenu: "",
    noodle: "",
    other: "",
    recommendType: "",
    recommendUrl: "",
  });

  const handlePlaceSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/search/places?query=${encodeURIComponent(searchQuery + " 떡볶이")}`,
      );
      if (!response.ok) throw new Error("검색 실패");

      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("장소 검색 오류:", error);
      alert("장소 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (place: PlaceSearchResult) => {
    const longitude = parseFloat(place.mapx) / 10000000;
    const latitude = parseFloat(place.mapy) / 10000000;

    setValue("name", place.title);
    setValue("address", place.roadAddress || place.address);
    setValue("phoneNumber", place.telephone || "");
    setValue("latitude", latitude);
    setValue("longitude", longitude);

    setStep(2);
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

  const handleClose = () => {
    const formData = getValues();
    setStep(1);
    setSearchQuery("");
    setSearchResults([]);
    setTempInputs({
      rice: "",
      sauce: "",
      sideMenu: "",
      noodle: "",
      other: "",
      recommendType: "",
      recommendUrl: "",
    });
    reset();
    close(formData);
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

      <div className={styles.content}>
        {step === 1 && (
          <h3 className={formStyle.formTitle}>
            {user?.user_metadata.name}님의
            <br />
            떡볶이 맛집은 어디인가요?
          </h3>
        )}
        {step === 1 ? (
          <PlaceSearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            loading={loading}
            handlePlaceSearch={handlePlaceSearch}
            handlePlaceSelect={handlePlaceSelect}
          />
        ) : (
          <RestaurantDetailForm
            setStep={setStep}
            onSubmit={onSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

const RestaurantForm = ({ isOpen, close }: RestaurantFormProps) => {
  if (!isOpen) return null;

  return (
    <RestaurantFormProvider>
      <div className={styles.overlay}>
        <RestaurantFormContent close={close} />
      </div>
    </RestaurantFormProvider>
  );
};

export default RestaurantForm;
