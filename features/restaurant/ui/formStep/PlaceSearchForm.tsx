"use client";

import clsx from "clsx";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Text } from "@/shared/ui/Text";
import { InputHead } from "@/shared/ui/InputHead";
import Spinner from "@/shared/ui/Spinner";
import { fixedBottom, mainButton } from "@/shared/style/variants";
import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import { useNaverPlaceSearch } from "@/features/search/api/use-place-search";

interface PlaceSearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  telephone: string;
  mapx: string;
  mapy: string;
}
type Props = {
  setStep: (step: number) => void;
};

const PlaceSearchForm = ({ setStep }: Props) => {
  const { setValue } = useFormContext<RestaurantFormData>();
  const [tempQuery, setTempQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useNaverPlaceSearch(searchQuery);

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

  const handleSearchStart = () => {
    setSearchQuery(tempQuery);
  };

  return (
    <div
      className="flex flex-col gap-2 justify-start items-start"
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <div className="w-full">
        <InputHead
          type="text"
          placeholder="상호명을 입력해 주세요"
          value={tempQuery}
          autoFocus={true}
          onChange={(e) => setTempQuery(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearchStart()}
        />
      </div>
      {data && data?.items.length > 0 && (
        <ul className="flex-1 w-[calc(100%+40px)] flex flex-col -mx-5 mt-5 pb-[calc(env(safe-area-inset-bottom,0)+88px)]">
          {data?.items.map((place, index) => (
            <li
              key={index}
              onClick={() => handlePlaceSelect(place)}
              className={clsx(
                "flex flex-col gap-1.5 justify-start items-start",
                "p-4 px-[22px] cursor-pointer hover:border-primary-300 hover:bg-primary-50",
              )}
            >
              <div>
                <Text
                  display="block"
                  color="primary-600"
                  className="text-lg font-medium"
                >
                  {place.title}
                </Text>
                <span className="text-base font-normal">
                  {place.roadAddress || place.address}
                </span>
              </div>
              <p className="flex gap-0.5 justify-start">
                {place.category.split(">").map((text) => (
                  <span
                    key={text}
                    className="bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-[4px] text-xs font-normal"
                  >
                    {text}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className={fixedBottom}>
        <button
          type="button"
          onClick={handleSearchStart}
          disabled={isLoading}
          className={mainButton}
        >
          {isLoading ? (
            <>
              <Spinner color="gray" size={24} thick={3} /> 검색 중
            </>
          ) : (
            "검색"
          )}
        </button>
      </div>
    </div>
  );
};

export default PlaceSearchForm;
