"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";

import Icons from "@/shared/ui/Icons";
import IconSymbol from "@/assets/IconSymbol";
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

// 사이드 버튼은 로그인 여부와 무관하게 같은 형태(가로 배열) — 3버튼일 때는 스케일만 한 단계 작게
const sideButtonCls =
  "flex flex-1 items-center justify-center break-keep min-h-13 text-gray-700";

const mainButtonCls =
  "flex items-center justify-center h-12 rounded-chip bg-primary-500 text-white border-[1.5px] border-ink shadow-pop gap-1.5 tracking-[-0.05rem] text-base font-semibold active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-[transform,box-shadow] duration-150";

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
          className={clsx(glassContainer, sideButtonCls, "gap-1.5")}
          data-flexible={true}
          onClick={openRegisterForm}
        >
          <Icons name="add" t="round" w="solid" size={20} />
          <span className="text-base font-medium text-gray-600">등록</span>
        </button>
      )}
      <button
        type="button"
        className={clsx(
          mainButtonCls,
          "flex-[1.7] justify-between! h-12",
          !showMemberActions && "text-xl",
        )}
        onClick={openSearch}
      >
        {/* 3버튼일 때는 폭이 좁아 라벨이 접히므로 "찾기"로 줄인다 */}
        <span className="flex-1 text-center pl-3 whitespace-nowrap">
          {showMemberActions ? "찾기" : "떡볶이집 찾기"}
        </span>
        <div className="h-12 flex items-center overflow-hidden rounded-r-3xl">
          <IconSymbol className="h-16 w-auto opacity-90" />
        </div>
      </button>
      {showMemberActions ? (
        <button
          type="button"
          className={clsx(glassContainer, sideButtonCls, "gap-1")}
          data-flexible={true}
          onClick={openFavorites}
        >
          <Icons name="star" t="round" w="bold" size={17} />
          <span className="text-base font-medium text-gray-600">즐겨찾기</span>
        </button>
      ) : (
        /* 비로그인 등록 버튼 — 누르면 openRegisterForm이 로그인 안내를 띄운다 */
        <button
          type="button"
          className={clsx(glassContainer, sideButtonCls, "gap-2")}
          data-flexible={true}
          onClick={openRegisterForm}
        >
          <Icons name="add" t="round" w="solid" size={26} />
          <span className="text-lg font-medium text-gray-600">등록</span>
        </button>
      )}
    </div>
  );
}

export default Navigation;
