import { floatingStyle } from "@/widgets/floating-menu/ui/floating.css";
import { useAuth } from "@/shared/context/AuthContext";
import { fonts, typo } from "@/shared/style/typo.css";
import { flexs } from "@/shared/style/container.css";
import { useRef, useEffect } from "react";
import { overlay } from "overlay-kit";
import RestaurantRegisterForm from "@/features/restaurant/ui/RestaurantForm";
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
      className={floatingStyle.container}
      data-open={isOpen}
    >
      <div className={flexs({ dir: "col", gap: "2", align: "start" })}>
        {!user ? (
          <button
            type="button"
            className={fonts.body3.medium}
            onClick={openLogin}
          >
            로그인 후{"\n"}이용해 주세요
          </button>
        ) : (
          <>
            <p className={fonts.body3.medium}>
              {user?.user_metadata.name}님,{"\n"}반갑습니다
            </p>
            <button
              type="button"
              onClick={signOut}
              className={typo({
                size: "caption1",
                weight: "medium",
                color: "gray500",
              })}
            >
              로그아웃
            </button>
          </>
        )}
        <ul className={floatingStyle.list}>
          {user && <li>내 작성 글</li>}
          <li>서비스 안내</li>
          <li>문의</li>
        </ul>
      </div>
    </div>
  );
}
