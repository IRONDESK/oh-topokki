"use client";

import { overlay } from "overlay-kit";
import { useAuth } from "@/contexts/AuthContext";
import Icons from "@/share/components/Icons";
import RestaurantRegisterForm from "@/components/restaurant/RestaurantForm";
import LoginModal from "@/components/login/LoginModal";
import Logo from "@/assets/Logo";
import { mapHeaderStyle as style } from "../css/mapHeader.css";

export default function MapHeader() {
  const { user } = useAuth();

  const openLoginModal = () => {
    overlay.open((controller) => <LoginModal {...controller} />);
  };

  return (
    <header className={style.container}>
      <div className={style.headerLogo}>
        <Logo />
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
