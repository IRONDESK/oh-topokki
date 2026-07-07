import { ComponentProps } from "react";
import type { OverlayAsyncControllerComponent } from "overlay-kit";
import ScrolledBottomSheet from "@/shared/ui/ScrolledBottomSheet";
import Button from "@/shared/ui/Button";

type Props = ComponentProps<OverlayAsyncControllerComponent<boolean>>;

const TERMS = [
  {
    title: "서비스 이용약관 동의 (필수)",
    contents:
      "오늘의 떡볶이 서비스 이용을 위한 기본 약관입니다. 커뮤니티에 등록한 맛집·리뷰 정보는 다른 사용자에게 공개되며, 허위 정보나 타인의 권리를 침해하는 게시물은 제재될 수 있습니다.",
  },
  {
    title: "개인정보 수집·이용 동의 (필수)",
    contents:
      "회원 가입과 서비스 제공을 위해 이메일, 닉네임을 수집·이용합니다. 수집한 정보는 회원 탈퇴 시 지체 없이 파기됩니다.",
  },
];

/** 회원가입 전 약관 동의 바텀시트. 확인 시 true, 스와이프/닫기 시 false로 resolve. */
const TermsConsentSheet = (props: Props) => {
  const { isOpen, close, unmount } = props;

  const agree = () => {
    close(true);
    setTimeout(unmount, 300);
  };

  return (
    <ScrolledBottomSheet
      controller={{ isOpen, close: () => close(false), unmount }}
    >
      {() => (
        <div className="min-h-0 h-full flex flex-col gap-5 px-5 pt-2">
          <h2 className="text-xl font-semibold text-ink">
            개인정보 제공 및 약관 동의
          </h2>

          {TERMS.map((term) => (
            <div key={term.title} className="flex flex-col gap-1.5">
              <p className="text-base font-semibold text-gray-700">
                {term.title}
              </p>
              <p className="text-sm font-normal text-gray-500 leading-relaxed">
                {term.contents}
              </p>
            </div>
          ))}

          <Button onClick={agree} className="w-full mt-1">
            동의하고 가입하기
          </Button>
        </div>
      )}
    </ScrolledBottomSheet>
  );
};

export default TermsConsentSheet;
