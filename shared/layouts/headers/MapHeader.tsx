"use client";
import { useEffect, useState } from "react";
import { overlay, useCurrentOverlay } from "overlay-kit";
import { Popover } from "@base-ui/react/popover";
import { useAtom } from "jotai";

import { cn } from "@/shared/lib/cn";
import Icons from "@/shared/ui/Icons";
import { mapFilterAtom } from "@/shared/store/filterStore";
import FloatingMenu from "@/widgets/floating-menu/ui/FloatingMenu";
import Logo from "@/assets/Logo";

// TODO: 실시간 인기 식당 API 연동 전 임시 목데이터.
// 추후 useRestaurantList(sort=popular) 등으로 교체. 형태는 ResponseRestaurant에 맞춤.
type PopularRestaurant = { id: string; name: string; reviewCount: number };

const POPULAR_RESTAURANTS: PopularRestaurant[] = [
  { id: "1", name: "우리네떡볶이 성수지점", reviewCount: 128 },
  { id: "2", name: "동대문엽기떡볶이 강남점", reviewCount: 96 },
  { id: "3", name: "신전떡볶이 홍대점", reviewCount: 74 },
  { id: "4", name: "청년다방 건대점", reviewCount: 51 },
  { id: "5", name: "죠스떡볶이 잠실점", reviewCount: 33 },
];

const SLIDE_INTERVAL = 2500;

function rankStyle(rank: number) {
  if (rank === 1) return "bg-primary-500 text-white";
  if (rank <= 3) return "bg-primary-200 text-primary-700";
  return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300";
}

export default function MapHeader() {
  const isOpenMenu = useCurrentOverlay() === "floating-menu";
  const [filters, setFilter] = useAtom(mapFilterAtom);
  const filterValues = Object.values(filters).filter((v) => v !== null);

  const [rankIndex, setRankIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isRankOpen, setIsRankOpen] = useState(false);

  // 인기 1~5위 위아래 슬라이딩. popover 열려 있는 동안은 정지.
  // 끝에 1위 복제본(아래 렌더)을 두고 거기까지 슬라이드한 뒤,
  // 애니메이션 없이 진짜 1위(index 0)로 순간 리셋해 5→1 무한 루프처럼 보이게 함.
  useEffect(() => {
    if (isRankOpen || POPULAR_RESTAURANTS.length <= 1) return;
    const timer = setInterval(() => {
      setIsAnimating(true);
      setRankIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isRankOpen]);

  // 복제본(= length 인덱스)까지 슬라이드가 끝나면 애니메이션 끄고 0으로 순간 이동.
  const handleSlideEnd = () => {
    if (rankIndex === POPULAR_RESTAURANTS.length) {
      setIsAnimating(false);
      setRankIndex(0);
    }
  };

  const openMenuFloat = () => {
    overlay.open((controller) => <FloatingMenu {...controller} />, {
      overlayId: "floating-menu",
    });
  };

  const FILTERS = [
    { name: "즉떡", key: "topokkiType", value: "ontable" },
    { name: "밀떡", key: "riceTypes", value: "flour" },
    { name: "로제", key: "sauceTypes", value: "rose" },
    { name: "쫄면", key: "noodleTypes", value: "jjolmyeon" },
    // 순대 칩은 "순대를 파는 집"(sundaeType이 null이 아닌 곳)을 의미 → 백엔드에서 not-null로 해석
    { name: "순대", key: "sundaeType", value: "exists" },
    { name: "5,000원", key: "maxPrice", value: 5000 },
  ];

  const handleFilterClick = (filter: { key: string; value: any }) => {
    setFilter((prev) => ({
      ...prev,
      [filter.key]:
        prev[filter.key as keyof typeof prev] === filter.value
          ? null
          : filter.value,
    }));
  };

  return (
    <header className="flex flex-col lg:flex-row lg:justify-between lg:w-full gap-0.5 lg:gap-4 pb-1 fixed top-0 w-screen min-h-14 pt-[env(safe-area-inset-top,16px)] text-base font-normal z-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-sm bg-linear-to-b from-white to-white/0 dark:from-black dark:to-black/0 mask-[linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <div className="px-3.5 w-full lg:w-fit flex justify-between items-center gap-0.5 lg:gap-3.5">
        <div className="flex justify-center items-center w-25 h-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]">
          <Logo className="h-10" />
        </div>
        <div className="flex px-2 flex-1 lg:flex-none lg:w-80">
          <div className="py-0.5 w-full flex">
            <Popover.Root open={isRankOpen} onOpenChange={setIsRankOpen}>
              <Popover.Trigger className="w-full flex items-center py-1 px-1.5 gap-1 cursor-pointer text-left rounded-lg hover:bg-gray-100/60">
                <div className="relative h-6 flex-1 overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0",
                      isAnimating &&
                        "transition-transform duration-500 ease-out",
                    )}
                    style={{ transform: `translateY(-${rankIndex * 1.5}rem)` }}
                    onTransitionEnd={handleSlideEnd}
                  >
                    {[...POPULAR_RESTAURANTS, POPULAR_RESTAURANTS[0]].map(
                      (item, idx) => {
                        // 마지막은 1위 복제본 → 순위는 항상 (실제 인덱스 % 길이) + 1
                        const rank = (idx % POPULAR_RESTAURANTS.length) + 1;
                        return (
                          <div
                            key={idx}
                            className="h-6 flex items-center gap-1.5"
                          >
                            <span
                              className={cn(
                                "shrink-0 size-4 flex items-center justify-center rounded text-[11px] font-bold leading-none",
                                rankStyle(rank),
                              )}
                            >
                              {rank}
                            </span>
                            <span className="flex-1 truncate text-sm text-gray-700">
                              {item.name}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
                {/* 화살표까지 트리거 영역에 포함 (중첩 button 방지 위해 span) */}
                <span className="size-6.5 flex justify-center items-center rounded-sm shrink-0 text-gray-700">
                  <Icons
                    name="angle-small-down"
                    t="round"
                    w="regular"
                    size={20}
                  />
                </span>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner
                  sideOffset={-34}
                  className="z-1000 w-(--anchor-width) rounded-lg bg-white dark:bg-black border border-gray-100 dark:border-gray-700 shadow-md pt-3 pb-2"
                >
                  <Popover.Popup>
                    <p className="px-3 pb-1.5 text-sm font-semibold text-primary-500">
                      실시간 인기 떡볶이
                    </p>
                    <ul>
                      {POPULAR_RESTAURANTS.map((item, idx) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span
                              className={cn(
                                "shrink-0 size-5 flex items-center justify-center rounded text-sm font-bold leading-none",
                                rankStyle(idx + 1),
                              )}
                            >
                              {idx + 1}
                            </span>
                            <span className="flex-1 truncate text-base text-gray-700">
                              {item.name}
                            </span>
                            <span className="shrink-0 text-sm text-gray-400">
                              리뷰 {item.reviewCount}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="lg:hidden">
          <button
            type="button"
            className={cn(
              "cursor-pointer size-6.5 border border-primary-400/50 flex justify-center items-center rounded-sm text-primary-400 transition-colors",
              isOpenMenu &&
                "bg-primary-600 text-primary-100 border-transparent",
            )}
            onClick={openMenuFloat}
          >
            <Icons name="menu-dots" t="round" w="bold" size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center py-1 px-2.5 gap-3">
        <ul className="inline-flex gap-1 overflow-x-auto items-center">
          {FILTERS.map((filter) => (
            <li
              key={filter.name}
              className={cn(
                "shrink-0 select-none cursor-pointer min-w-13 text-center px-2.5 py-1 rounded-chip bg-primary-50 border border-primary-500/30 text-primary-600 text-sm lg:text-sm transition-[transform,box-shadow] duration-150",
                "data-[selected=true]:bg-primary-500 data-[selected=true]:border-ink data-[selected=true]:text-white data-[selected=true]:font-semibold data-[selected=true]:shadow-pop",
              )}
              data-selected={filterValues.includes(filter.value)}
              onClick={() => handleFilterClick(filter)}
            >
              {filter.name}
            </li>
          ))}
        </ul>
        <div className="lg:block hidden">
          <button
            type="button"
            className={cn(
              "cursor-pointer size-6.5 border border-primary-400/50 flex justify-center items-center rounded-sm text-primary-400 transition-colors",
              isOpenMenu &&
                "bg-primary-600 text-primary-100 border-transparent",
            )}
            onClick={openMenuFloat}
          >
            <Icons name="menu-dots" t="round" w="bold" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
