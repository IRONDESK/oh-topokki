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
      <div className="w-full h-full flex flex-col justify-between pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col gap-1.5 w-[calc(100%+40px)] -mx-5 -mt-4 pt-12 pb-0 px-5 text-gray-700 whitespace-pre-wrap text-center">
          <h3 className="text-lg font-medium">
            오늘의 떡볶이는 무엇으로 할까요?
          </h3>
          <h2 className="text-3xl font-semibold">
            <span className="inline-flex pt-1 pr-0.5 translate-y-1 [&>svg]:w-[116px] [&>svg]:h-auto">
              <Logo />
            </span>
            에서 찾아보는{"\n"}내 입맛의 떡볶이
          </h2>
        </div>
        {message && (
          <div className="w-max inline-flex items-center justify-center gap-1.5 mx-auto mb-40 p-5 min-w-[55%] bg-primary-50 rounded-lg border border-primary-100 text-primary-600 text-base font-medium">
            <Icons name="triangle-warning" t="round" w="solid" size={20} />
            {message}
          </div>
        )}
        <EmailAuthForm onSuccess={close} />
      </div>
    </Modal>
  );
};

export default LoginModal;
