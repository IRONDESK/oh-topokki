"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { overlay } from "overlay-kit";
import { useAuth } from "@/contexts/AuthContext";

import Icons from "@/share/components/Icons";
import { glassContainer } from "@/share/components/css/share.css";
import { navigationStyle as style } from "@/share/layouts/navigation.css";
import RestaurantRegisterForm from "@/components/restaurant/RestaurantForm";
import LoginModal from "@/components/login/LoginModal";

function Navigation() {
  const params = useSearchParams();
  const tab = params.get("tab");
  const { user } = useAuth();

  const openRegisterForm = () => {
    if (user) {
      overlay.open((controller) => <RestaurantRegisterForm {...controller} />);
    } else {
      overlay.open((controller) => (
        <LoginModal message="로그인 후에 작성할 수 있어요" {...controller} />
      ));
    }
  };

  return (
    <div className={style.container}>
      <button
        type="button"
        className={clsx(glassContainer, style.button)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
      >
        <Icons name="search" t="round" w="bold" size={20} />
        <span className={style.btnText}>검색</span>
      </button>
      <button
        type="button"
        className={clsx(glassContainer, style.mainButton)}
        data-flexible={true}
        onClick={tab ? () => {} : openRegisterForm}
      >
        <Icons name={tab ? "map" : "add"} t="round" w="solid" size={28} />
        {!tab && "새 맛집 등록"}
      </button>
      <button
        type="button"
        className={clsx(glassContainer, style.button)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
      >
        <Icons name="star" t="round" w="bold" size={20} />
        <span className={style.btnText}>즐겨찾기</span>
      </button>
    </div>
  );
}

export default Navigation;
