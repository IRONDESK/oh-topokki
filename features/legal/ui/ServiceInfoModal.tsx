import { ComponentProps } from "react";
import type { OverlayControllerComponent } from "overlay-kit";
import { format } from "date-fns";
import Logo from "@/assets/Logo";
import { Modal } from "@/shared/ui/Modal";
import LegalTabs from "@/features/legal/ui/LegalTabs";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;
const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE;

/** [메뉴 > 서비스 안내]: 로고·앱 버전(마지막 배포일) + 약관 탭 */
export default function ServiceInfoModal(
  props: ComponentProps<OverlayControllerComponent>,
) {
  return (
    <Modal {...props}>
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-end gap-2.5">
          <span className="[&>svg]:w-26 [&>svg]:h-auto">
            <Logo />
          </span>
          <span className="pb-0.5 text-sm font-medium text-gray-500">
            v{APP_VERSION}
            {BUILD_DATE && ` (${format(BUILD_DATE, "yyyy.MM.dd")})`}
          </span>
        </div>
        {/* 스크롤 컨테이너의 상단 패딩(pt-4)만큼 올려 고정 시 틈이 없게 한다 */}
        <LegalTabs listClassName="-mx-5 px-5 -top-4 pt-4" />
      </div>
    </Modal>
  );
}
