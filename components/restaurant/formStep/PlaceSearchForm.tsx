"use client";

import { fixedBottom, flexs, fullwidth } from "@/style/container.css";
import * as styles from "../RestaurantForm.css";
import { InputHead } from "@/share/components/InputHead";
import { align, fonts } from "@/style/typo.css";
import Spinner from "@/share/components/Spinner";
import { mainButton } from "@/share/components/css/share.css";
import clsx from "clsx";
import { Text } from "@/share/components/Text";
import { category } from "../RestaurantForm.css";

interface PlaceSearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  telephone: string;
  mapx: string;
  mapy: string;
}

interface PlaceSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: PlaceSearchResult[];
  loading: boolean;
  handlePlaceSearch: () => Promise<void>;
  handlePlaceSelect: (place: PlaceSearchResult) => void;
}

const PlaceSearchForm = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  loading,
  handlePlaceSearch,
  handlePlaceSelect,
}: PlaceSearchFormProps) => {
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
          value={searchQuery}
          autoFocus={true}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handlePlaceSearch()}
        />
      </div>
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((place, index) => (
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
          onClick={handlePlaceSearch}
          disabled={loading}
          className={mainButton}
        >
          {loading ? (
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
