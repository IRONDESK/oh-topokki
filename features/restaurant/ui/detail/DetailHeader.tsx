import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { useNativeShare } from "@/shared/hooks/useNativeShare";
import { useFavorite } from "@/features/favorite/api/use-favorite";
import Icons from "@/shared/ui/Icons";
import { restaurantPath } from "@/shared/constants/site";

type Props = {
  restaurantId: string;
  name?: string;
  // 상호명 아래 한 줄 요약 (예: "판떡볶이 · 리뷰 3 · 조회 12"). sticky 상태에선 숨김
  meta?: string;
  isFavorite?: boolean | null;
  isSticky: boolean;
};

const STICKY_AREA_CLS =
  "sticky top-0 flex items-start gap-3 px-5 pb-1 bg-white data-[sticky=true]:items-center data-[sticky=true]:pt-2.5 data-[sticky=true]:pb-3 data-[sticky=true]:shadow-[0_1px_0_var(--color-gray-100)] data-[sticky=true]:z-10 data-[desktop=true][data-sticky=true]:pt-4 data-[desktop=true][data-sticky=true]:pb-4";

const ICON_BTN_CLS =
  "cursor-pointer size-9 -m-1.5 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50";

/** 상세 상단 sticky 헤더: 상호명·요약 + 즐겨찾기·공유 */
export default function DetailHeader({
  restaurantId,
  name,
  meta,
  isFavorite,
  isSticky,
}: Props) {
  const isDesktop = useIsDesktop();
  const { handleFavorite } = useFavorite();
  const { share } = useNativeShare();

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
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 break-keep">{name}</h2>
        {!isSticky && meta && (
          <p className="mt-1 text-sm text-gray-500">{meta}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => handleFavorite(restaurantId)}
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
          className={ICON_BTN_CLS}
        >
          <Icons
            name="star"
            w={isFavorite ? "solid" : "regular"}
            size={22}
            color={isFavorite ? "var(--color-primary-500)" : undefined}
          />
        </button>
        <button
          type="button"
          onClick={onClickShare}
          aria-label="공유하기"
          className={ICON_BTN_CLS}
        >
          <Icons name="share" w="regular" size={22} />
        </button>
      </div>
    </div>
  );
}
