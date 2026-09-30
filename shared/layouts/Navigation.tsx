"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";

import Icons from "@/shared/ui/Icons";
import { glassContainer } from "@/shared/style/variants";
import LoginModal from "@/features/auth/ui/LoginModal";
import SearchModal from "@/features/search/ui/SearchModal";
import FavoritesList from "@/features/favorite/ui/FavoritesList";
import { dialog } from "@/shared/ui/feature/dialog";

// 등록 폼(react-hook-form·필드 컴포넌트)은 버튼을 눌렀을 때만 필요하므로 분리 로드
const RestaurantRegisterForm = dynamic(
  () => import("@/features/restaurant/ui/RestaurantForm"),
);

const containerCls =
  "select-none fixed bottom-0 left-1/2 -translate-x-1/2 mb-[calc(env(safe-area-inset-bottom,16px)-4px)] flex items-center justify-center gap-2 pb-4 w-[min(90vw,380px)]";

const sideButtonCls =
  "flex flex-1 flex-col justify-center items-center w-max break-keep min-h-[52px] gap-0.5 text-gray-700";

const mainButtonCls =
  "flex items-center justify-center h-[52px] rounded-chip bg-primary-500 text-white border-[1.5px] border-ink shadow-pop gap-1.5 tracking-[-0.05rem] text-base font-semibold active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow] duration-150";

const btnTextCls = "text-xs font-normal text-gray-600";

function Navigation() {
  const { user, loading } = useAuth();
  // 세션 확인 전에는 회원용 버튼을 그리지 않아 로그인 상태에서의 깜빡임을 감수하고
  // 비로그인 상태에서의 노출(더 흔한 첫 진입)을 막는다.
  const showMemberActions = !loading && !!user;

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
      {showMemberActions && (
        <button
          type="button"
          className={clsx(glassContainer, sideButtonCls)}
          data-flexible={true}
          style={{ paddingTop: "2px" }}
          onClick={openRegisterForm}
        >
          <Icons name="add" t="round" w="solid" size={20} />
          <span className={btnTextCls}>맛집 등록</span>
        </button>
      )}
      <button
        type="button"
        className={clsx(
          mainButtonCls,
          showMemberActions ? "flex-[1.7]" : "flex-none px-7",
        )}
        onClick={openSearch}
      >
        <Icons name="search" t="round" w="bold" size={20} />
        떡볶이집 찾기
      </button>
      {showMemberActions && (
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
      )}
    </div>
  );
}

export default Navigation;
