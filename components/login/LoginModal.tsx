import { ComponentProps } from "react";
import type { OverlayControllerComponent } from "overlay-kit";

import { fonts } from "@/style/typo.css";
import { flexs } from "@/style/container.css";
import { loginStyle } from "@/components/login/login.css";
import Logo from "@/assets/Logo";
import { Modal } from "@/share/components/Modal";
import Icons from "@/share/components/Icons";
import LoginButton from "@/components/login/LoginButton";

type Props = ComponentProps<OverlayControllerComponent> & {
  message?: string;
};
const LoginModal = (props: Props) => {
  const { isOpen, close, unmount, message } = props;

  return (
    <Modal isOpen={isOpen} close={close} unmount={unmount}>
      <div className={loginStyle.inner}>
        <div className={loginStyle.container}>
          <h3 className={fonts.body2.medium}>
            오늘의 떡볶이는 무엇으로 할까요?
          </h3>
          <h2 className={fonts.head5.semibold}>
            <span className={loginStyle.logoBox}>
              <Logo />
            </span>
            에서 찾아보는{"\n"}내 입맛의 떡볶이
          </h2>
        </div>
        {message && (
          <div className={loginStyle.message}>
            <Icons name="triangle-warning" t="round" w="solid" size={22} />
            {message}
          </div>
        )}
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
      </div>
    </Modal>
  );
};

export default LoginModal;
