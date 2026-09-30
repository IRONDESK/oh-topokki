import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { useNativeShare } from "@/shared/hooks/useNativeShare";
import { useFavorite } from "@/features/favorite/api/use-favorite";
import { useDeleteRestaurant } from "@/features/restaurant/api/use-restaurant";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { dialog } from "@/shared/ui/feature/dialog";
import Icons from "@/shared/ui/Icons";
import { cn } from "@/shared/lib/cn";
import { restaurantPath } from "@/shared/constants/site";

// 수정 폼(react-hook-form 등)은 작성자만 쓰므로 필요할 때 로드
const RestaurantForm = dynamic(
  () => import("@/features/restaurant/ui/RestaurantForm"),
);

type Props = {
  restaurantId: string;
  name?: string;
  address?: string;
  restaurant?: ResponseRestaurant;
  isSticky: boolean;
  onClose: () => void;
};

const STICKY_AREA_CLS =
  "sticky flex items-center px-5 pb-4 bg-white top-0 data-[sticky=true]:gap-1 data-[sticky=true]:px-4 data-[sticky=true]:pt-2.5 data-[sticky=true]:pb-3 data-[sticky=true]:shadow-lg data-[sticky=true]:z-10 data-[desktop=true]:px-4 data-[desktop=true]:pb-4 data-[desktop=true][data-sticky=true]:px-4 data-[desktop=true][data-sticky=true]:pt-4 data-[desktop=true][data-sticky=true]:pb-9 data-[desktop=true][data-sticky=true]:shadow-none data-[desktop=true][data-sticky=true]:[background:linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]";

const ICON_BTN_CLS = "cursor-pointer text-gray-500";

/** 상세 상단 sticky 헤더: 상호/주소 + 수정·삭제·즐겨찾기·공유 액션 */
export default function DetailHeader({
  restaurantId,
  name,
  address,
  restaurant,
  isSticky,
  onClose,
}: Props) {
  const isDesktop = useIsDesktop();
  const { user } = useAuth();
  const { handleFavorite } = useFavorite();
  const { share } = useNativeShare();
  const { mutate: deleteRestaurant } = useDeleteRestaurant();

  const isAuthor =
    !!user && !!restaurant?.authorId && restaurant.authorId === user.id;

  const onClickEdit = () => {
    if (!restaurant) return;
    // 수정 폼이 뜨면 기존 상세 바텀시트는 정리한다
    onClose();
    overlay.open((formController) => (
      <RestaurantForm {...formController} restaurant={restaurant} />
    ));
  };

  const onClickDelete = async () => {
    const ok = await dialog.confirm({
      title: "맛집을 삭제할까요?",
      contents: "등록된 리뷰와 즐겨찾기도 함께 삭제되며 되돌릴 수 없어요.",
    });
    if (!ok) return;

    deleteRestaurant(
      { restaurantId },
      {
        onSuccess: () => {
          dialog.alert({ title: "맛집을 삭제했어요" });
          onClose();
        },
        onError: (error) => {
          dialog.alert({ title: "삭제에 실패했어요", contents: error.message });
        },
      },
    );
  };

  const onClickShare = () =>
    share({
      title: `${name} - 오늘의떡볶이`,
      text: `${name}의 떡볶이 정보를 확인해보세요!`,
      url: `${window.location.origin}${restaurantPath(restaurantId)}`,
    });

  return (
    <div
      data-sticky={isSticky}
      data-desktop={isDesktop}
      className={STICKY_AREA_CLS}
    >
      <div className="flex-1">
        <h2
          className={cn(
            "text-xl font-semibold transition-[font-size] duration-300",
            isSticky ? "py-2" : "pb-px",
          )}
        >
          {name}
        </h2>
        {!isSticky && (
          <p className="text-sm font-normal text-gray-400">{address}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isAuthor && (
          <>
            <button
              type="button"
              onClick={onClickEdit}
              aria-label="맛집 정보 수정"
              className={cn(ICON_BTN_CLS, "hover:text-gray-700")}
            >
              <Icons name="pencil" w="regular" size={22} />
            </button>
            <button
              type="button"
              onClick={onClickDelete}
              aria-label="맛집 삭제"
              className={cn(ICON_BTN_CLS, "hover:text-red-500")}
            >
              <Icons name="trash" w="regular" size={22} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => handleFavorite(restaurantId)}
          aria-label="즐겨찾기"
          className="cursor-pointer text-primary-600"
        >
          <Icons
            name="star"
            w={restaurant?.isFavorite ? "solid" : "regular"}
            size={24}
          />
        </button>
        <button type="button" onClick={onClickShare} aria-label="공유하기">
          <Icons name="share" w="regular" size={24} />
        </button>
      </div>
    </div>
  );
}
