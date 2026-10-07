import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";
import { useMyRestaurants } from "@/features/restaurant/api/use-restaurant";
import { useOpenRestaurantDetail } from "@/features/restaurant/model/detail-navigation";
import { ResponseMyRestaurant } from "@/shared/api/model/restaurant";
import { TOPOKKI_TYPE } from "@/shared/constants/restaurant";

import ScrolledBottomSheet, {
  closeSheet,
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import UserAvatar from "@/features/auth/ui/UserAvatar";
import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";

const WithdrawSheet = dynamic(() => import("@/features/auth/ui/WithdrawSheet"));

type Props = {
  controller: SheetController;
};

/** 내 정보: 프로필(아바타·닉네임·이메일) + 설정(로그아웃/회원탈퇴) + 내 작성글 목록 */
export default function MyInfoSheet({ controller }: Props) {
  const { user, signOut } = useAuth();
  const openDetail = useOpenRestaurantDetail();
  const { data: myRestaurants, isLoading } = useMyRestaurants({
    enabled: !!user,
  });

  const [settingOpen, setSettingOpen] = useState(false);
  const settingRef = useRef<HTMLDivElement>(null);

  // 설정 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    if (!settingOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (settingRef.current && !settingRef.current.contains(e.target as Node)) {
        setSettingOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [settingOpen]);

  const onLogout = async () => {
    setSettingOpen(false);
    // signOut으로 user가 null이 되면 렌더가 끊기므로 닫기 애니메이션을 먼저 시작한다
    closeSheet(controller);
    await signOut();
  };

  const onWithdraw = () => {
    setSettingOpen(false);
    closeSheet({
      close: controller.close,
      unmount: () => {
        controller.unmount();
        overlay.open((c) => <WithdrawSheet controller={c} />);
      },
    });
  };

  // 작성글 시트를 닫고 상세 시트를 연다 (즐겨찾기 목록과 동일 패턴)
  const onClickItem = (item: ResponseMyRestaurant) => {
    closeSheet({
      close: controller.close,
      unmount: () => {
        controller.unmount();
        openDetail(item.id);
      },
    });
  };

  if (!user) return null;

  return (
    <ScrolledBottomSheet controller={controller}>
      {() => (
        <div>
          <div className="relative flex flex-col items-center gap-2 px-5 pt-3 pb-6">
            <UserAvatar image={user.image} nickname={user.nickname} size={64} />
            <p className="text-xl font-semibold text-ink">{user.nickname}</p>
            <div ref={settingRef} className="relative flex items-center gap-1.5">
              <span className="text-sm font-normal text-gray-500">
                {user.email}
              </span>
              <button
                type="button"
                aria-label="계정 설정"
                className="cursor-pointer flex items-center justify-center size-6 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setSettingOpen((v) => !v)}
              >
                <Icons name="settings-sliders" t="round" w="bold" size={13} />
              </button>

              {settingOpen && (
                <ul className="absolute right-0 top-7 z-10 min-w-28 py-1 bg-white border border-gray-200 rounded-card shadow-sticker text-sm font-normal text-gray-600">
                  <li>
                    <button
                      type="button"
                      className="cursor-pointer w-full px-3.5 py-2 text-left hover:bg-gray-100"
                      onClick={onLogout}
                    >
                      로그아웃
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="cursor-pointer w-full px-3.5 py-2 text-left text-red-500 hover:bg-red-50"
                      onClick={onWithdraw}
                    >
                      회원탈퇴
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="h-2 bg-gray-100" />

          <section className="px-5 py-5">
            <h3 className="pb-2 text-base font-semibold text-gray-700">
              내 작성글 목록
            </h3>

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Spinner size={32} thick={3} color="primary" />
              </div>
            )}

            {!isLoading && (!myRestaurants || myRestaurants.length === 0) && (
              <div className="py-10 text-center">
                <span className="text-base font-normal text-gray-500">
                  등록한 맛집이 없어요
                </span>
              </div>
            )}

            <div>
              {myRestaurants?.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer w-full px-1 py-3 border-b border-gray-100 last-of-type:border-b-0"
                  onClick={() => onClickItem(item)}
                >
                  <p className="flex justify-between items-center gap-1">
                    <span className="text-base font-medium text-gray-700">
                      {item.name}
                    </span>
                    {item.topokkiType && (
                      <span className="text-xs font-medium text-primary-400">
                        {TOPOKKI_TYPE[item.topokkiType]}
                      </span>
                    )}
                  </p>
                  <p className="flex justify-between items-center gap-1">
                    <span className="text-sm font-normal text-gray-500">
                      {item.address.split(" ").slice(0, 2).join(" ")}
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                      리뷰 {item.reviewCount}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </ScrolledBottomSheet>
  );
}
