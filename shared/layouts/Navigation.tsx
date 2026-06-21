"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";

import Icons from "@/shared/ui/Icons";
import { glassContainer } from "@/shared/style/variants";
import RestaurantRegisterForm from "@/features/restaurant/ui/RestaurantForm";
import LoginModal from "@/features/auth/ui/LoginModal";
import SearchModal from "@/features/search/ui/SearchModal";
import FavoritesList from "@/features/favorite/ui/FavoritesList";
import { dialog } from "@/shared/ui/feature/dialog";

const containerCls =
  "select-none fixed bottom-0 left-1/2 -translate-x-1/2 mb-[calc(env(safe-area-inset-bottom,16px)-4px)] flex gap-2 items-center pb-4 w-[min(90vw,380px)]";

const sideButtonCls =
  "flex flex-1 flex-col justify-center items-center w-max break-keep shadow-sm min-h-[52px] gap-0.5 text-gray-700";

const mainButtonCls =
  "flex-[1.7] h-[52px] !bg-[rgba(245,78,38,0.73)] text-white !border-[rgba(245,78,38,0.55)] gap-1.5 tracking-[-0.05rem] text-base font-semibold";

const btnTextCls = "text-xs font-normal text-gray-600";

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
    <div className={containerCls}>
      <button
        type="button"
        className={clsx(glassContainer, sideButtonCls)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
        onClick={openSearch}
      >
        <Icons name="search" t="round" w="bold" size={20} />
        <span className={btnTextCls}>검색</span>
      </button>
      <button
        type="button"
        className={clsx(glassContainer, mainButtonCls)}
        data-flexible={true}
        onClick={tab ? () => {} : openRegisterForm}
      >
        <Icons name={tab ? "map" : "add"} t="round" w="solid" size={28} />
        {!tab && "새 맛집 등록"}
      </button>
      <button
        type="button"
        className={clsx(glassContainer, sideButtonCls)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
        onClick={openFavorites}
      >
        <Icons name="star" t="round" w="bold" size={20} />
        <span className={btnTextCls}>즐겨찾기</span>
      </button>
    </div>
  );
}

export default Navigation;
