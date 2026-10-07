import { useAuth } from "@/shared/context/AuthContext";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import LoginModal from "@/features/auth/ui/LoginModal";
import UserAvatar from "@/features/auth/ui/UserAvatar";
import Icons from "@/shared/ui/Icons";

// 약관 본문/내 정보 시트는 열 때만 로드
const ServiceInfoModal = dynamic(
  () => import("@/features/legal/ui/ServiceInfoModal"),
);
const MyInfoSheet = dynamic(() => import("@/features/auth/ui/MyInfoSheet"));

const CONTACT_EMAIL = "todaytopokki@gmail.com";

type Props = {
  close: () => void;
  unmount: () => void;
  isOpen: boolean;
};
export default function FloatingMenu(props: Props) {
  const { isOpen, close, unmount } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  const onClose = () => {
    close();
    setTimeout(() => unmount(), 150);
  };

  const openLogin = () => {
    overlay.open((controller) => <LoginModal {...controller} />);
  };

  const openMyInfo = () => {
    onClose();
    overlay.open((controller) => <MyInfoSheet controller={controller} />);
  };

  const openServiceInfo = () => {
    onClose();
    overlay.open((controller) => <ServiceInfoModal {...controller} />);
  };

  const onLogout = async () => {
    await signOut();
    onClose();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  return (
    <div
      ref={containerRef}
      data-open={isOpen}
      className={[
        "fixed top-0 mt-[env(safe-area-inset-top,16px)] right-2.5 px-3.5 py-4 z-900",
        "bg-white shadow-sticker rounded-card min-w-45",
        "transform-[translate3d(0,0,0)_scale(0.2)] opacity-0 filter-[brightness(1.05)]",
        "[transition:transform_0.3s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s]",
        "origin-top-right whitespace-pre-wrap text-left",
        "data-[open=true]:opacity-100 data-[open=true]:transform-[translate3d(0,50px,0)_scale(1)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-0.5 w-full text-center justify-center">
        {!user ? (
          <button
            type="button"
            className="text-base font-medium text-center"
            onClick={openLogin}
          >
            로그인 후{"\n"}이용해 주세요
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 px-1">
              <UserAvatar image={user.image} nickname={user.nickname} size={32} />
              <span className="text-base font-medium text-gray-800 truncate">
                {user.nickname}
              </span>
            </div>
            <button
              type="button"
              onClick={openMyInfo}
              className="cursor-pointer mt-1.5 flex items-center justify-center gap-0.5 w-full py-1.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              내 정보
              <Icons name="angle-small-right" w="regular" size={15} />
            </button>
          </>
        )}
        <ul className="flex flex-col text-left gap-px text-gray-600 border-t border-gray-200 w-full mt-2 pt-2 text-sm font-normal [&>li]:cursor-pointer [&>li]:py-1">
          <li
            className="p-2 hover:bg-gray-100 rounded-sm"
            onClick={openServiceInfo}
          >
            서비스 안내
          </li>
          <li
            className="p-2 hover:bg-gray-100 rounded-sm"
            onClick={() => {
              window.location.href = `mailto:${CONTACT_EMAIL}`;
            }}
          >
            문의
          </li>
          {user && (
            <li
              className="p-2 hover:bg-gray-100 rounded-sm text-gray-400"
              onClick={onLogout}
            >
              로그아웃
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
