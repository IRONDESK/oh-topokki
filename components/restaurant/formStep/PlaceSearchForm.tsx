"use client";

import clsx from "clsx";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Text } from "@/share/components/Text";
import { InputHead } from "@/share/components/InputHead";
import Spinner from "@/share/components/Spinner";
import { fixedBottom, flexs, fullwidth } from "@/style/container.css";
import { fonts } from "@/style/typo.css";
import * as styles from "../RestaurantForm.css";
import { mainButton } from "@/share/components/css/share.css";
import { RestaurantFormData } from "@/components/restaurant/RestaurantForm";
import { useGetNaverMapSearch } from "@/share/hooks/naver-map";

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
  const { data, isLoading } = useGetNaverMapSearch(searchQuery);

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
      className={flexs({
        dir: "col",
        gap: "8",
        justify: "start",
        align: "start",
      })}
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <div className={fullwidth}>
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
        <ul className={styles.searchResults}>
          {data?.items.map((place, index) => (
            <li
              key={index}
              className={clsx(
                flexs({
                  dir: "col",
                  gap: "6",
                  justify: "start",
                  align: "start",
                }),
                styles.searchResult,
              )}
              onClick={() => handlePlaceSelect(place)}
            >
              <div>
                <Text
                  display="block"
                  color="primary-600"
                  className={fonts.body2.medium}
                >
                  {place.title}
                </Text>
                <span className={fonts.body3.regular}>
                  {place.roadAddress || place.address}
                </span>
              </div>
              <p className={clsx(flexs({ gap: "2", justify: "start" }))}>
                {place.category.split(">").map((text) => (
                  <span key={text} className={styles.category}>
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
