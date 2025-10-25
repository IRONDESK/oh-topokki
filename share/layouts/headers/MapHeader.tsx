"use client";

import { overlay } from "overlay-kit";
import { useAtom } from "jotai";

import Logo from "@/assets/Logo";
import Icons from "@/share/components/Icons";
import FloatingMenu from "@/components/FloatingMenu";
import { flexs } from "@/style/container.css";
import { mapHeaderStyle as style } from "../css/mapHeader.css";
import { mapFilterAtom } from "@/store/filterStore";

export default function MapHeader() {
  const [filters, setFilter] = useAtom(mapFilterAtom);
  const filterValues = Object.values(filters).filter((v) => v !== null);

  const openMenuFloat = () => {
    overlay.open((controller) => <FloatingMenu {...controller} />);
  };

  const FILTERS = [
    { name: "즉떡", key: "topokkiType", value: "ontable" },
    { name: "밀떡", key: "topokkiType", value: "flour" },
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
    <header className={style.container}>
      <div className={flexs({ gap: "4" })}>
        <button type="button" className={style.menu} onClick={openMenuFloat}>
          <Icons name="menu-burger" t="round" w="regular" size={18} />
        </button>
        <div className={style.headerLogo}>
          <Logo />
        </div>
      </div>
      <ul className={style.filterList}>
        {FILTERS.map((filter) => (
          <li
            key={filter.name}
            className={style.filterItem}
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
