"use client";

import { overlay } from "overlay-kit";
import Icons from "@/share/components/Icons";
import Logo from "@/assets/Logo";
import { mapHeaderStyle as style } from "../css/mapHeader.css";

import { flexs } from "@/style/container.css";
import FloatingMenu from "@/components/FloatingMenu";

export default function MapHeader() {
  const openMenuFloat = () => {
    overlay.open((controller) => <FloatingMenu {...controller} />);
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
        <li className={style.filterItem}>즉떡</li>
        <li className={style.filterItem} data-selected={true}>
          밀떡
        </li>
        <li className={style.filterItem}>로제</li>
        <li className={style.filterItem}>쫄면</li>
        <li className={style.filterItem}>순대</li>
        <li className={style.filterItem}>5000원</li>
      </ul>
    </header>
  );
}
