import { useAuth } from "@/shared/context/AuthContext";
import { useEffect, useRef } from "react";
import { overlay } from "overlay-kit";
import LoginModal from "@/features/auth/ui/LoginModal";

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
            <p className="text-base text-center font-medium">
              {user?.nickname}님의{"\n"}오늘의 떡볶이는
            </p>
            <button
              type="button"
              onClick={signOut}
              className="cursor-pointer m-auto mt-1 py-1 px-2 rounded-md text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-500 hover:border-gray-300 border border-transparent "
            >
              로그아웃
            </button>
          </>
        )}
        <ul className="flex flex-col text-left  gap-px text-gray-600 border-t border-gray-200 w-full mt-2 pt-2 text-sm font-normal [&>li]:cursor-pointer [&>li]:py-1">
          {user && (
            <li className="p-2 hover:bg-gray-100 rounded-sm">내 작성 글</li>
          )}
          <li className="p-2 hover:bg-gray-100 rounded-sm">서비스 안내</li>
          <li className="p-2 hover:bg-gray-100 rounded-sm">문의</li>
        </ul>
      </div>
    </div>
  );
}
