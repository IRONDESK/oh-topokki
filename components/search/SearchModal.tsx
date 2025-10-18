import { ComponentProps, useEffect, useState } from "react";
import { debounce } from "es-toolkit";
import { useQuery } from "@tanstack/react-query";
import { useMapLocation } from "@/hooks/useMapLocation";
import { useAtomValue } from "jotai";
import type { OverlayControllerComponent } from "overlay-kit";
import { Location, naverMapAtom } from "@/store/locationStore";
import { useNaverMap } from "@/hooks/useNaverMap";

import ScrolledBottomSheet from "@/share/components/ScrolledBottomSheet";
import { InputHead } from "@/share/components/InputHead";
import { typo } from "@/style/typo.css";
import { flexRatio, flexs } from "@/style/container.css";
import { searchStyle as style } from "@/components/search/search.css";
import { getRestaurantSearch } from "@/service/naver-map";
import HighlightKeyword from "@/components/search/Highlight";
import Icons from "@/share/components/Icons";
import { theme } from "@/style/theme.css";

type Props = {
  controller: ComponentProps<OverlayControllerComponent>;
};

function SearchModal({ controller }: Props) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const map = useAtomValue(naverMapAtom);
  const { naver } = useNaverMap();
  const { setLocation, getFormattedDistanceFromCurrent } = useMapLocation();

  const { data, isLoading } = useQuery({
    enabled: debounced.length > 0,
    queryKey: ["getRestaurantSearch", debounced],
    queryFn: () =>
      getRestaurantSearch({
        query: debounced,
      }),
  });

  useEffect(() => {
    const debounced = debounce(() => {
      setDebounced(input);
    }, 150);
    debounced();
    return () => {
      debounced.cancel?.();
    };
  }, [input]);

  useEffect(() => {
    return () => {
      setInput("");
      setDebounced("");
    };
  }, []);

  const onClickRestaurant = (location: Location) => {
    if (!map || !naver) return;

    // 지도 중심점과 줌을 동시에 설정
    const offsetLat = 0.00195;
    const targetLocation = new naver.LatLng(
      location.lat - offsetLat,
      location.lng,
    );

    // 위치와 줌을 동시에 설정
    map.setCenter(targetLocation);
    map.setZoom(17);
  };

  return (
    <ScrolledBottomSheet controller={controller}>
      {({ isFull, isSticky }) => (
        <div className={style.container}>
          <div className={style.inputContainer}>
            <InputHead
              type="text"
              placeholder="상호명이나 메뉴를 입력해 주세요"
              small={true}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus={true}
            />
          </div>

          <div
            className={flexs({
              dir: "col",
              gap: "20",
              align: "start",
            })}
          >
            {data?.items.map((item, index) => {
              const matchedTexts = [...item.sideMenus, ...item.others].filter(
                (text) => text.includes(debounced),
              );

              return (
                <div
                  key={item.id}
                  className={style.resultItem}
                  onClick={() =>
                    onClickRestaurant({
                      lat: item.latitude,
                      lng: item.longitude,
                    })
                  }
                >
                  <div className={style.resultPin}>{index + 1}</div>
                  <div className={flexRatio["1"]}>
                    <p
                      className={flexs({
                        justify: "spb",
                        align: "center",
                      })}
                    >
                      <span
                        className={typo({
                          size: "body3",
                          weight: "medium",
                          color: "gray700",
                        })}
                      >
                        <HighlightKeyword
                          text={item.name}
                          keyword={debounced}
                          highlightClassName={typo({
                            color: "primary500",
                          })}
                        />
                      </span>
                      <span
                        className={typo({
                          size: "body4",
                          weight: "regular",
                          color: "gray600",
                        })}
                      >
                        {TOPOKKI_TYPE[item.topokkiType]}
                      </span>
                    </p>
                    <p
                      className={flexs({
                        justify: "spb",
                        align: "center",
                      })}
                    >
                      <span
                        className={typo({
                          size: "caption1",
                          weight: "regular",
                          color: "gray500",
                        })}
                      >
                        {item.address}
                      </span>
                      <span
                        id="distance"
                        className={typo({
                          size: "body4",
                          weight: "regular",
                          color: "gray500",
                        })}
                      >
                        {getFormattedDistanceFromCurrent(
                          item.latitude,
                          item.longitude,
                        ) || "-"}
                      </span>
                    </p>
                    {matchedTexts.length > 0 && (
                      <p
                        className={flexs({
                          align: "center",
                          justify: "start",
                          gap: "4",
                        })}
                      >
                        <Icons
                          name="tags"
                          w="regular"
                          t="round"
                          color={theme.color.primary["500"]}
                        />
                        {matchedTexts.map((text) => (
                          <HighlightKeyword
                            key={text}
                            text={text}
                            keyword={debounced}
                            highlightClassName={style.matchedKeyword}
                          />
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

const TOPOKKI_TYPE: Record<string, string> = {
  ontable: "즉석떡볶이",
  pan: "판떡볶이",
  soup: "국물떡볶이",
};

export default SearchModal;
