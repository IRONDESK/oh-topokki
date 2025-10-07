import { ComponentProps } from "react";
import type { OverlayControllerComponent } from "overlay-kit";
import { Modal } from "@/share/components/Modal";
import { fonts } from "@/style/typo.css";
import { loginStyle } from "@/components/login/login.css";
import { theme } from "@/style/theme.css";
import LoginButton from "@/components/login/LoginButton";
import { flexs } from "@/style/container.css";

type Props = ComponentProps<OverlayControllerComponent>;
const LoginModal = (props: Props) => {
  const { isOpen, close, unmount } = props;

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      unmount={unmount}
      headerBgColor={theme.color.primary["600"]}
    >
      <div className={loginStyle.container}>
        <h3 className={fonts.body2.medium} style={{ marginBottom: "4px" }}>
          오늘의 떡볶이는 무엇으로 할까요?
        </h3>
        <h2 className={fonts.head6.semibold}>
          오떠끼에서 찾아보는{"\n"}내 입맛의 떡볶이
        </h2>
      </div>
      <div
        className={flexs({
          dir: "col",
          gap: "12",
        })}
        style={{
          padding: "20px 0 0",
          width: "100%",
        }}
      >
        <LoginButton provider="kakao">카카오로 시작</LoginButton>
        <LoginButton provider="naver">네이버로 시작</LoginButton>
      </div>
    </Modal>
  );
};

export default LoginModal;
