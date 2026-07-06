import { ComponentProps } from "react";
import type { OverlayControllerComponent } from "overlay-kit";

import Logo from "@/assets/Logo";
import { Modal } from "@/shared/ui/Modal";
import Icons from "@/shared/ui/Icons";
import EmailAuthForm from "@/features/auth/ui/EmailAuthForm";

type Props = ComponentProps<OverlayControllerComponent> & {
  message?: string;
};
const LoginModal = (props: Props) => {
  const { isOpen, close, unmount, message } = props;

  return (
    <Modal isOpen={isOpen} close={close} unmount={unmount}>
      <div className="flex-1 w-full h-full flex flex-col justify-between pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="flex-1 flex flex-col items-center gap-6.5">
          <div className="flex flex-col gap-1.5 -mx-5 -mt-4 pt-12 pb-0 px-5 text-gray-700 whitespace-pre-wrap text-center">
            <h3 className="text-lg font-medium">
              오늘의 떡볶이는 무엇으로 할까요?
            </h3>
            <h2 className="text-3xl font-semibold">
              <span className="inline-flex pt-1 pr-0.5 translate-y-1 [&>svg]:w-26 [&>svg]:h-auto">
                <Logo />
              </span>
              에서 찾아보는{"\n"}내 입맛의{" "}
              <span className="text-primary-500">떡볶이</span>
            </h2>
          </div>

          {message && (
            <div className="select-none w-max inline-flex items-center justify-center gap-1.5 mx-auto px-5.5 py-3 min-w-[55%] rounded-full text-primary-600 text-base">
              <Icons name="triangle-warning" t="round" w="solid" size={18} />
              {message}
            </div>
          )}
        </div>
        <EmailAuthForm onSuccess={close} />
      </div>
    </Modal>
  );
};

export default LoginModal;
