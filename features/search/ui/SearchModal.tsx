import { ComponentProps, useEffect, useState } from "react";
import Image from "next/image";
import { debounce } from "es-toolkit";
import { useMapLocation } from "@/shared/hooks/useMapLocation";
import { useAtomValue } from "jotai";
import type { OverlayControllerComponent } from "overlay-kit";
import { naverMapAtom } from "@/shared/store/locationStore";
import { useRouter } from "next/navigation";
import { useNaverMap } from "@/shared/hooks/useNaverMap";

import ScrolledBottomSheet from "@/shared/ui/ScrolledBottomSheet";
import { InputHead } from "@/shared/ui/InputHead";
import { typo } from "@/shared/style/typo.css";
import { flexRatio, flexs } from "@/shared/style/container.css";
import { searchStyle as style } from "@/features/search/ui/search.css";
import { useRestaurantSearch } from "@/features/restaurant/api/use-restaurant";
import HighlightKeyword from "@/features/search/ui/Highlight";
import Icons from "@/shared/ui/Icons";
import { theme } from "@/shared/style/theme.css";
import Spinner from "@/shared/ui/Spinner";
import { buttons } from "@/shared/ui/css/share.css";
import NaverMapIcon from "@/assets/navermap.webp";

type Props = {
  controller: ComponentProps<OverlayControllerComponent>;
};

function SearchModal({ controller }: Props) {
  const router = useRouter();
  const { naver } = useNaverMap();
  const map = useAtomValue(naverMapAtom);
  const { getFormattedDistanceFromCurrent } = useMapLocation();

  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState("");

  const { data, isLoading } = useRestaurantSearch(debounced);

  useEffect(() => {
    const debounced = debounce(() => {
      setDebounced(input);
    }, 300);
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

  const onClickRestaurant = (location: {
    restaurantId: string;
    lat: number;
    lng: number;
  }) => {
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

    setSelected(location.restaurantId);
  };

  const onClickDetail = (id: string) => {
    router.push(`/?restaurant=${id}`);
  };
  const openNaverMapView = (location: { lat: number; lng: number }) => {};

  return (
    <ScrolledBottomSheet controller={controller}>
      {({ isFull, isSticky }) => (
        <div className={style.container}>
          <div className={style.inputContainer}>
            <InputHead
              type="text"
              placeholder="상호명이나 메뉴를 입력해 주세요"
              fontSize="body1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus={true}
            />
          </div>

          {isLoading && (
            <div
              style={{ paddingTop: "32px" }}
              className={flexs({
                justify: "center",
                align: "center",
              })}
            >
              <Spinner size={32} thick={3} color="primary" />
            </div>
          )}

          <div
            className={flexs({
              dir: "col",
              gap: "24",
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
                      restaurantId: item.id,
                    })
                  }
                >
                  <div
                    className={flexs({ gap: "12" })}
                    style={{ width: "100%" }}
                  >
                    {/*<div className={style.resultPin}>{index + 1}</div>*/}
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

                  {selected === item.id && (
                    <div className={style.resultItemButton}>
                      <button
                        type="button"
                        onClick={() => onClickDetail(item.id)}
                        className={buttons({
                          fill: "outlined",
                          size: "medium",
                        })}
                      >
                        상세보기
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openNaverMapView({
                            lat: item.latitude,
                            lng: item.longitude,
                          })
                        }
                        className={buttons({
                          fill: "assistive",
                          size: "medium",
                        })}
                      >
                        <Image
                          src={NaverMapIcon}
                          alt=""
                          width={26}
                          height={26}
                        />
                        지도앱
                      </button>
                    </div>
                  )}
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
