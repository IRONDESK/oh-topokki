"use client";

import { overlay } from "overlay-kit";
import { useAtom } from "jotai";

import Logo from "@/assets/Logo";
import Icons from "@/shared/ui/Icons";
import FloatingMenu from "@/widgets/floating-menu/ui/FloatingMenu";
import { mapFilterAtom } from "@/shared/store/filterStore";

const containerCls =
  "flex justify-between items-center gap-2 fixed top-0 w-[calc(min(1280px,100vw))] min-h-12 pt-[env(safe-area-inset-top,16px)] pl-2.5 z-[1000] text-base font-normal";

const menuCls =
  "cursor-pointer w-9 h-8 rounded-[10px] bg-primary-500 text-white flex items-center justify-center border-[1.5px] border-ink shadow-sticker-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow] duration-150";

const logoCls =
  "flex justify-center items-center w-[100px] h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]";

const filterListCls =
  "flex-1 inline-flex gap-1 overflow-x-auto pr-4 items-center";

const filterItemCls =
  "shrink-0 select-none cursor-pointer min-w-[54px] px-3.5 py-1.5 rounded-chip bg-white border-[1.5px] border-primary-200 text-center text-primary-700 shadow-sticker-sm text-base font-medium transition-[transform,box-shadow] duration-150 data-[selected=true]:bg-primary-500 data-[selected=true]:border-ink data-[selected=true]:text-white data-[selected=true]:font-semibold data-[selected=true]:shadow-pop";

export default function MapHeader() {
  const [filters, setFilter] = useAtom(mapFilterAtom);
  const filterValues = Object.values(filters).filter((v) => v !== null);

  const openMenuFloat = () => {
    overlay.open((controller) => <FloatingMenu {...controller} />);
  };

  const FILTERS = [
    { name: "즉떡", key: "topokkiType", value: "ontable" },
    { name: "밀떡", key: "riceTypes", value: "flour" },
    { name: "로제", key: "sauceTypes", value: "rose" },
    { name: "쫄면", key: "noodleTypes", value: "jjolmyeon" },
    // 순대 칩은 "순대를 파는 집"(sundaeType이 null이 아닌 곳)을 의미 → 백엔드에서 not-null로 해석
    { name: "순대", key: "sundaeType", value: "exists" },
    { name: "5000원", key: "maxPrice", value: 5000 },
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
    <header className={containerCls}>
      <div className="flex items-center gap-1">
        <button type="button" className={menuCls} onClick={openMenuFloat}>
          <Icons name="menu-burger" t="round" w="regular" size={18} />
        </button>
        <div className={logoCls}>
          <Logo />
        </div>
      </div>
      <ul className={filterListCls}>
        {FILTERS.map((filter) => (
          <li
            key={filter.name}
            className={filterItemCls}
            data-selected={filterValues.includes(filter.value)}
            onClick={() => handleFilterClick(filter)}
          >
            {filter.name}
          </li>
        ))}
      </ul>
    </header>
  );
}
