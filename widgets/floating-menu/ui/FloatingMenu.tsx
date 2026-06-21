import { useAuth } from "@/shared/context/AuthContext";
import { useRef, useEffect } from "react";
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
        "fixed top-0 mt-[env(safe-area-inset-top,16px)] left-2.5 px-4 py-3.5",
        "border-l border-t border-l-white border-t-white border-r border-b border-r-transparent border-b-transparent",
        "bg-white/55 shadow-md backdrop-blur-[4px] rounded-[20px] min-w-[160px]",
        "[transform:translate3d(0,0,0)_scale(0.2)] opacity-0 [filter:brightness(1.05)]",
        "[transition:transform_0.3s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s]",
        "origin-top-left whitespace-pre-wrap text-left",
        "data-[open=true]:opacity-100 data-[open=true]:[transform:translate3d(0,50px,0)_scale(1)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-0.5 items-start">
        {!user ? (
          <button
            type="button"
            className="text-base font-medium"
            onClick={openLogin}
          >
            로그인 후{"\n"}이용해 주세요
          </button>
        ) : (
          <>
            <p className="text-base font-medium">
              {user?.user_metadata.name}님,{"\n"}반갑습니다
            </p>
            <button
              type="button"
              onClick={signOut}
              className="text-xs font-medium text-gray-500"
            >
              로그아웃
            </button>
          </>
        )}
        <ul className="flex flex-col gap-px text-gray-600 border-t border-gray-300 w-full mt-3 pt-3 text-sm font-normal [&>li]:cursor-pointer [&>li]:py-1">
          {user && <li>내 작성 글</li>}
          <li>서비스 안내</li>
          <li>문의</li>
        </ul>
      </div>
    </div>
  );
}
