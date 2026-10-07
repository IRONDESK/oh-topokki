import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import { Tabs } from "@base-ui/react/tabs";
import { useAuth } from "@/shared/context/AuthContext";
import { useMyRestaurants } from "@/features/restaurant/api/use-restaurant";
import { useMyReviews } from "@/features/review/api/use-review";
import { useOpenRestaurantDetail } from "@/features/restaurant/model/detail-navigation";
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

type MyTab = "restaurants" | "reviews";

const TAB_CLS =
  "cursor-pointer flex-1 py-3 text-base font-medium text-gray-400 transition-colors data-[active]:text-ink data-[active]:font-semibold";
const ITEM_CLS =
  "cursor-pointer w-full px-1 py-3 border-b border-gray-100 last-of-type:border-b-0";

function ListLoading() {
  return (
    <div className="flex justify-center items-center py-8">
      <Spinner size={32} thick={3} color="primary" />
    </div>
  );
}

function ListEmpty({ text }: { text: string }) {
  return (
    <div className="py-10 text-center">
      <span className="text-base font-normal text-gray-500">{text}</span>
    </div>
  );
}

/** 내 정보: 프로필(아바타·닉네임·이메일) + 설정(로그아웃/회원탈퇴) + [내 작성글 | 내 리뷰] 탭 */
export default function MyInfoSheet({ controller }: Props) {
  const { user, signOut } = useAuth();
  const openDetail = useOpenRestaurantDetail();
  const [tab, setTab] = useState<MyTab>("restaurants");
  const { data: myRestaurants, isLoading } = useMyRestaurants({
    enabled: !!user,
  });
  // 리뷰 탭을 처음 열 때 조회 (이후엔 캐시 사용)
  const { data: myReviews, isLoading: isReviewsLoading } = useMyReviews({
    enabled: !!user && tab === "reviews",
  });

  const [settingOpen, setSettingOpen] = useState(false);
  const settingRef = useRef<HTMLDivElement>(null);

  // 설정 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    if (!settingOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        settingRef.current &&
        !settingRef.current.contains(e.target as Node)
      ) {
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

  // 내 정보 시트를 닫고 해당 맛집 상세 시트를 연다 (즐겨찾기 목록과 동일 패턴)
  const openRestaurant = (restaurantId: string) => {
    closeSheet({
      close: controller.close,
      unmount: () => {
        controller.unmount();
        openDetail(restaurantId);
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
            <div
              ref={settingRef}
              className="relative flex items-center gap-1.5"
            >
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

          <Tabs.Root
            value={tab}
            onValueChange={(value) => setTab(value as MyTab)}
            className="flex flex-col"
          >
            <Tabs.List className="relative flex px-5 border-b border-gray-200">
              <Tabs.Tab value="restaurants" className={TAB_CLS}>
                내 작성글
              </Tabs.Tab>
              <Tabs.Tab value="reviews" className={TAB_CLS}>
                내 리뷰
              </Tabs.Tab>
              <Tabs.Indicator className="absolute bottom-[-1px] left-(--active-tab-left) w-(--active-tab-width) h-0.5 bg-primary-500 transition-[left,width] duration-200" />
            </Tabs.List>

            <Tabs.Panel value="restaurants" className="px-5 py-3">
              {isLoading && <ListLoading />}
              {!isLoading && !myRestaurants?.length && (
                <ListEmpty text="등록한 맛집이 없어요" />
              )}
              {myRestaurants?.map((item) => (
                <div
                  key={item.id}
                  className={ITEM_CLS}
                  onClick={() => openRestaurant(item.id)}
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
            </Tabs.Panel>

            <Tabs.Panel value="reviews" className="px-5 py-3">
              {isReviewsLoading && <ListLoading />}
              {!isReviewsLoading && !myReviews?.length && (
                <ListEmpty text="작성한 리뷰가 없어요" />
              )}
              {myReviews?.map((review) => (
                // 식당 이름(작게) / [리뷰 내용(1줄, 넘치면 …)] [별점]
                <div
                  key={review.id}
                  className={ITEM_CLS}
                  onClick={() => openRestaurant(review.restaurant.id)}
                >
                  <p className="truncate text-xs font-medium text-gray-400">
                    {review.restaurant.name}
                  </p>
                  <p className="flex items-center gap-2.5 pt-0.5">
                    <span className="flex-1 min-w-0 truncate text-base font-normal text-gray-700">
                      {review.content}
                    </span>
                    {review.rating != null && (
                      <span className="shrink-0 flex items-center gap-0.5 text-sm font-medium text-primary-500">
                        <Icons
                          name="star"
                          w="solid"
                          size={12}
                          color="var(--color-primary-500)"
                        />
                        {review.rating}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      )}
    </ScrolledBottomSheet>
  );
}
