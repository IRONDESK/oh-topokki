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
  "cursor-pointer w-9 h-8 rounded-md bg-primary-500 text-white flex items-center justify-center border-l border-t border-l-[rgba(245,78,38,0.55)] border-t-[rgba(245,78,38,0.55)] border-r border-b border-r-transparent border-b-transparent";

const logoCls =
  "flex justify-center items-center w-[100px] h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]";

const filterListCls =
  "flex-1 inline-flex gap-1 overflow-x-auto pr-4 items-center";

const filterItemCls =
  "shrink-0 select-none cursor-pointer min-w-[54px] px-3.5 py-[5px] rounded-[32px] bg-white/65 backdrop-blur-[4px] border-t border-l border-white text-center text-gray-600 shadow-sm text-base font-medium hover:brightness-105 data-[selected=true]:bg-primary-500 data-[selected=true]:border-primary-200 data-[selected=true]:text-white data-[selected=true]:font-semibold";

export default function MapHeader() {
  const [filters, setFilter] = useAtom(mapFilterAtom);
  const filterValues = Object.values(filters).filter((v) => v !== null);

  const openMenuFloat = () => {
    overlay.open((controller) => <FloatingMenu {...controller} />);
  };

  const FILTERS = [
    { name: "즉떡", key: "topokkiType", value: "ontable" },
    { name: "밀떡", key: "riceKinds", value: "flour" },
    { name: "로제", key: "noodleType", value: "rose" },
    { name: "쫄면", key: "noodleType", value: "jolmyun" },
    { name: "순대", key: "sundaeType", value: "sundae" },
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
