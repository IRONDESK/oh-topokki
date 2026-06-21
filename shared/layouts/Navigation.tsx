"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";

import Icons from "@/shared/ui/Icons";
import { glassContainer } from "@/shared/ui/css/share.css";
import { navigationStyle as style } from "@/shared/layouts/navigation.css";
import RestaurantRegisterForm from "@/features/restaurant/ui/RestaurantForm";
import LoginModal from "@/features/auth/ui/LoginModal";
import SearchModal from "@/features/search/ui/SearchModal";
import FavoritesList from "@/features/favorite/ui/FavoritesList";
import { dialog } from "@/shared/ui/feature/dialog";

function Navigation() {
  const params = useSearchParams();
  const tab = params.get("tab");
  const { user } = useAuth();

  const openSearch = () => {
    overlay.open((controller) => <SearchModal controller={controller} />);
  };
  const openFavorites = async () => {
    if (user) {
      overlay.open((controller) => <FavoritesList controller={controller} />);
    } else {
      const confirm = await dialog.confirm({
        title: "로그인이 필요해요",
        contents: "로그인 화면으로 이동할까요?",
      });
      if (confirm) {
        overlay.open((controller) => (
          <LoginModal message="로그인 후에 확인할 수 있어요" {...controller} />
        ));
      }
    }
  };
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
        onClick={openSearch}
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
        onClick={openFavorites}
      >
        <Icons name="star" t="round" w="bold" size={20} />
        <span className={style.btnText}>즐겨찾기</span>
      </button>
    </div>
  );
}

export default Navigation;
