import { useEffect, useMemo, useState } from "react";
import { debounce } from "es-toolkit";
import { useAtomValue } from "jotai";
import { useMapFocus } from "@/shared/hooks/useMapFocus";
import { useDistanceFromUser } from "@/shared/hooks/useUserLocation";
import { useOpenRestaurantDetail } from "@/features/restaurant/model/detail-navigation";
import { userGpsLocationAtom } from "@/shared/store/locationStore";

import ScrolledBottomSheet, {
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import { InputHead } from "@/shared/ui/InputHead";
import {
  hasAnySearchFilter,
  useRestaurantList,
  useRestaurantSearch,
} from "@/features/restaurant/api/use-restaurant";
import HighlightKeyword from "@/features/search/ui/Highlight";
import SearchFilter, {
  activeFilterTags,
} from "@/features/search/ui/SearchFilter";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "@/features/search/model/recent-search";
import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";
import NaverMapButton from "@/shared/ui/NaverMapButton";
import { buttons } from "@/shared/style/variants";
import { TOPOKKI_TYPE } from "@/shared/constants/restaurant";
import { SearchRestaurantFilters } from "@/shared/api/model/restaurant";
import { cn } from "@/shared/lib/cn";
import { calculateDistance } from "@/shared/lib/distance";

type Props = {
  controller: SheetController;
};

const sectionTitleCls = "text-sm font-semibold text-gray-500";

function SearchModal({ controller }: Props) {
  const openDetail = useOpenRestaurantDetail();
  const focusMap = useMapFocus();
  const distanceFromUser = useDistanceFromUser();
  const gps = useAtomValue(userGpsLocationAtom);

  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchRestaurantFilters>({});
  const [recent, setRecent] = useState<string[]>([]);

  const keyword = debounced.trim();
  const filterActive = hasAnySearchFilter(filters);

  // 패널이 열려 있는 동안에도 같은 쿼리로 "N곳 보기" 카운트를 미리 보여준다
  const { data, isLoading } = useRestaurantSearch(
    debounced,
    filterActive ? filters : undefined,
  );

  // 검색 조건이 아무것도 없을 때 보여줄 주변의 떡볶이 (GPS 없으면 조회하지 않음)
  const idle = !filterOpen && keyword === "" && !filterActive;
  const { data: nearbyData } = useRestaurantList(
    { lat: gps?.lat, lng: gps?.lng, radius: 3000 },
    { enabled: !!gps && idle },
  );
  const nearby = useMemo(() => {
    if (!gps || !nearbyData) return [];
    return [...nearbyData]
      .sort(
        (a, b) =>
          calculateDistance(gps.lat, gps.lng, a.latitude, a.longitude) -
          calculateDistance(gps.lat, gps.lng, b.latitude, b.longitude),
      )
      .slice(0, 3);
  }, [gps, nearbyData]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    const d = debounce(() => {
      setDebounced(input);
    }, 300);
    d();
    return () => {
      d.cancel?.();
    };
  }, [input]);

  const rememberKeyword = () => {
    if (keyword) setRecent(addRecentSearch(keyword));
  };

  const showResults = !filterOpen && (keyword !== "" || filterActive);
  const filterTags = activeFilterTags(filters);

  return (
    <ScrolledBottomSheet controller={controller}>
      {({ expand }) => (
        // 필터 모드에서는 full 높이를 채워 하단 버튼(mt-auto)이 시트 바닥에 붙게 한다
        <div className={cn("px-4", filterOpen && "flex min-h-full flex-col")}>
          <div className="flex items-center gap-2 px-0.5 py-1 pb-2.5 mb-2.5 border-b border-gray-200">
            <button
              type="button"
              aria-label="필터"
              className={cn(
                "shrink-0 size-8 flex justify-center items-center rounded-lg border transition-colors",
                filterActive
                  ? "bg-primary-500 border-ink text-white"
                  : filterOpen
                    ? "bg-primary-50 border-primary-500/50 text-primary-600"
                    : "border-gray-200 text-gray-500",
              )}
              onClick={() => {
                const next = !filterOpen;
                setFilterOpen(next);
                if (next) {
                  // 필터 폼이 길어서 반 열림 시트에서는 하단 버튼이 잘림 → full로 확장
                  expand();
                  (document.activeElement as HTMLElement | null)?.blur();
                }
              }}
            >
              <Icons name="settings-sliders" t="round" w="bold" size={15} />
            </button>
            <InputHead
              type="text"
              placeholder="상호명이나 메뉴를 입력해 주세요"
              fontSize="body1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") rememberKeyword();
              }}
              autoFocus={true}
            />
          </div>

          {/* 필터 모드: 필터 폼만 보여준다 */}
          {filterOpen && (
            <SearchFilter
              filters={filters}
              onChange={setFilters}
              onApply={() => setFilterOpen(false)}
              onReset={() => setFilters({})}
              resultCount={
                filterActive || keyword !== ""
                  ? (data?.pagination.totalCount ?? null)
                  : null
              }
            />
          )}

          {/* 기본 모드: 최근 검색어 + 주변의 떡볶이 */}
          {idle && (
            <div className="flex flex-col gap-5 pt-1">
              {recent.length > 0 && (
                <section className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className={sectionTitleCls}>최근 검색어</h3>
                    <button
                      type="button"
                      className="text-xs text-gray-400"
                      onClick={() => setRecent(clearRecentSearches())}
                    >
                      전체 삭제
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {recent.map((term) => (
                      <li
                        key={term}
                        className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-chip bg-gray-100 text-sm text-gray-700"
                      >
                        <button type="button" onClick={() => setInput(term)}>
                          {term}
                        </button>
                        <button
                          type="button"
                          aria-label={`${term} 삭제`}
                          className="flex items-center text-gray-400"
                          onClick={() => setRecent(removeRecentSearch(term))}
                        >
                          <Icons name="cross" t="round" w="bold" size={10} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {nearby.length > 0 && (
                <section className="flex flex-col gap-1">
                  <h3 className={cn(sectionTitleCls, "pb-1")}>주변의 떡볶이</h3>
                  <ul>
                    {nearby.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2.5 py-2 text-left"
                          onClick={() => {
                            focusMap({
                              lat: item.latitude,
                              lng: item.longitude,
                            });
                            openDetail(item.id, item);
                          }}
                        >
                          <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium">
                            {TOPOKKI_TYPE[item.topokkiType]}
                          </span>
                          <span className="flex-1 truncate text-base text-gray-700">
                            {item.name}
                          </span>
                          <span className="shrink-0 text-sm text-gray-500">
                            {distanceFromUser(item.latitude, item.longitude)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* 결과 모드: 적용된 필터 태그 + 결과 리스트 */}
          {showResults && filterTags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pb-2.5">
              {filterTags.map((tag) => (
                <li
                  key={tag.id}
                  className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-chip bg-primary-50 border border-primary-500/30 text-sm font-medium text-primary-700"
                >
                  {tag.label}
                  <button
                    type="button"
                    aria-label={`${tag.label} 필터 해제`}
                    className="flex items-center text-primary-400"
                    onClick={() => setFilters(tag.remove(filters))}
                  >
                    <Icons name="cross" t="round" w="bold" size={10} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showResults && isLoading && (
            <div className="flex justify-center items-center pt-8">
              <Spinner size={32} thick={3} color="primary" />
            </div>
          )}

          {showResults && !isLoading && data && data.items.length === 0 && (
            <p className="pt-8 text-center text-sm text-gray-500">
              {filterActive
                ? "조건에 맞는 떡볶이집이 없어요"
                : "검색 결과가 없어요"}
            </p>
          )}

          {showResults && (
            <div className="flex flex-col gap-6 items-start">
              {data?.items.map((item) => {
                const matchedTexts =
                  keyword === ""
                    ? []
                    : [...item.sideMenus, ...item.others].filter((text) =>
                        text.includes(keyword),
                      );

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      focusMap({ lat: item.latitude, lng: item.longitude });
                      setSelected(item.id);
                      rememberKeyword();
                    }}
                    className="flex flex-col gap-3 cursor-pointer w-full first-of-type:pt-2.5"
                  >
                    <div className="flex gap-3 w-full">
                      <div className="flex-1">
                        <p className="flex justify-between items-center">
                          <span className="text-base font-medium text-gray-700">
                            <HighlightKeyword
                              text={item.name}
                              keyword={keyword}
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
                            {distanceFromUser(item.latitude, item.longitude) ??
                              "-"}
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
                                keyword={keyword}
                                highlightClassName="text-xs font-medium px-1.5 py-0.5 rounded-md bg-primary-50 border border-primary-200 text-primary-700"
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
                          onClick={() => openDetail(item.id, item)}
                          className={buttons({
                            fill: "outlined",
                            size: "medium",
                          })}
                        >
                          상세보기
                        </button>
                        <NaverMapButton place={item} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

export default SearchModal;
