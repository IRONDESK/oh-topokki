"use client";

import Link from "next/link";
import { overlay } from "overlay-kit";
import { useAuth } from "@/contexts/AuthContext";
import Icons from "@/share/components/Icons";
import { headerStyle } from "@/share/layouts/layout.css";
import RestaurantRegisterForm from "@/components/restaurant/RestaurantForm";
import LoginModal from "@/components/login/LoginModal";

export default function Header() {
  const { user } = useAuth();
  const openRegisterForm = () => {
    overlay.open((controller) => (
      <RestaurantRegisterForm
        isOpen={controller.isOpen}
        close={controller.close}
      />
    ));
  };
  const openLoginModal = () => {
    overlay.open((controller) => <LoginModal {...controller} />);
  };

  return (
    <header className={headerStyle.container}>
      <div className={headerStyle.headerLogo}></div>
      <ul className={headerStyle.filterList}>
        <li className={headerStyle.filterItem}>내용</li>
        <li className={headerStyle.filterItem} data-selected={true}>
          내용
        </li>
        <li className={headerStyle.filterItem}>
          <Icons w="brands" name="search" size={16} />
        </li>
      </ul>

      <button className={headerStyle.headerSearch} onClick={openLoginModal}>
        <Icons w="bold" t="round" name="sign-in-alt" size={20} />
      </button>
      {user && (
        <button
          type="button"
          className={headerStyle.headerSearch}
          onClick={openRegisterForm}
        >
          <Icons w="solid" t="round" name="pencil" size={20} />
        </button>
      )}
    </header>
  );
}
