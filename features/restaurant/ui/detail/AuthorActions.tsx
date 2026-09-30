import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import { useAuth } from "@/shared/context/AuthContext";
import { useDeleteRestaurant } from "@/features/restaurant/api/use-restaurant";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { dialog } from "@/shared/ui/feature/dialog";

// 수정 폼(react-hook-form 등)은 작성자만 쓰므로 필요할 때 로드
const RestaurantForm = dynamic(
  () => import("@/features/restaurant/ui/RestaurantForm"),
);

const TEXT_BTN_CLS =
  "cursor-pointer px-1 py-0.5 text-sm font-medium text-gray-500 hover:text-gray-700";

/** 맛집을 등록한 사람에게만 보이는 수정·삭제 */
export default function AuthorActions({
  restaurant,
  onClose,
}: {
  restaurant: ResponseRestaurant;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { mutate: deleteRestaurant } = useDeleteRestaurant();

  if (!user || !restaurant.authorId || restaurant.authorId !== user.id) {
    return null;
  }

  const onClickEdit = () => {
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
      { restaurantId: restaurant.id },
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

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="text-sm text-gray-600">내가 등록한 맛집이에요</span>
      <span className="flex items-center gap-2">
        <button type="button" onClick={onClickEdit} className={TEXT_BTN_CLS}>
          수정
        </button>
        <span aria-hidden className="h-3 w-px bg-gray-200" />
        <button type="button" onClick={onClickDelete} className={TEXT_BTN_CLS}>
          삭제
        </button>
      </span>
    </div>
  );
}
