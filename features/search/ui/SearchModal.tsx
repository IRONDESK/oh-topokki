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
import { useRestaurantSearch } from "@/features/restaurant/api/use-restaurant";
import HighlightKeyword from "@/features/search/ui/Highlight";
import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";
import { buttons } from "@/shared/style/variants";
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
    const d = debounce(() => {
      setDebounced(input);
    }, 300);
    d();
    return () => {
      d.cancel?.();
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
    const offsetLat = 0.00195;
    const targetLocation = new naver.LatLng(
      location.lat - offsetLat,
      location.lng,
    );
    map.setCenter(targetLocation);
    map.setZoom(17);
    setSelected(location.restaurantId);
  };

  const onClickDetail = (id: string) => {
    router.push(`/?restaurant=${id}`);
  };
  const openNaverMapView = (_location: { lat: number; lng: number }) => {};

  return (
    <ScrolledBottomSheet controller={controller}>
      {() => (
        <div className="px-4">
          <div className="px-0.5 py-1 pb-2.5 mb-2.5 border-b border-gray-200">
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
            <div className="flex justify-center items-center pt-8">
              <Spinner size={32} thick={3} color="primary" />
            </div>
          )}

          <div className="flex flex-col gap-6 items-start">
            {data?.items.map((item) => {
              const matchedTexts = [...item.sideMenus, ...item.others].filter(
                (text) => text.includes(debounced),
              );

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    onClickRestaurant({
                      lat: item.latitude,
                      lng: item.longitude,
                      restaurantId: item.id,
                    })
                  }
                  className="flex flex-col gap-3 cursor-pointer w-full first-of-type:pt-2.5"
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-1">
                      <p className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-700">
                          <HighlightKeyword
                            text={item.name}
                            keyword={debounced}
                            highlightClassName="text-primary-500"
                          />
                        </span>
                        <span className="text-sm font-normal text-gray-600">
                          {TOPOKKI_TYPE[item.topokkiType]}
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-xs font-normal text-gray-500">
                          {item.address}
                        </span>
                        <span
                          id="distance"
                          className="text-sm font-normal text-gray-500"
                        >
                          {getFormattedDistanceFromCurrent(
                            item.latitude,
                            item.longitude,
                          ) || "-"}
                        </span>
                      </p>
                      {matchedTexts.length > 0 && (
                        <p className="flex items-center justify-start gap-1">
                          <Icons
                            name="tags"
                            w="regular"
                            t="round"
                            color="var(--color-primary-500)"
                          />
                          {matchedTexts.map((text) => (
                            <HighlightKeyword
                              key={text}
                              text={text}
                              keyword={debounced}
                              highlightClassName="text-xs font-medium px-1 py-0.5 rounded-[2px] bg-primary-50 text-primary-600"
                            />
                          ))}
                        </p>
                      )}
                    </div>
                  </div>

                  {selected === item.id && (
                    <div className="flex gap-2 w-full mb-2">
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
