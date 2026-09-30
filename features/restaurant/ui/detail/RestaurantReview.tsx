import { useState } from "react";
import { useReviews } from "@/features/review/api/use-review";
import { ResponseReview } from "@/shared/api/model/restaurant";
import Icons from "@/shared/ui/Icons";
import ReviewItem from "@/features/review/ui/ReviewItem";
import ReviewComposer from "@/features/review/ui/ReviewComposer";

type Props = {
  restaurantId: string;
  initialReviews: ResponseReview[];
  restaurantAuthorId: string | null;
};

const EMPTY_CLS =
  "mt-10 mb-16 mx-auto flex flex-col items-center gap-2 text-gray-500 text-base font-medium";
const REVIEWS_CLS =
  "flex flex-col gap-8 my-1.5 mb-[calc(env(safe-area-inset-bottom)+32px)] pb-4 text-gray-700 text-sm font-normal";

/** 리뷰 섹션: 목록 + 하단 입력창 */
function RestaurantReview({
  restaurantId,
  initialReviews,
  restaurantAuthorId,
}: Props) {
  const { data: reviews } = useReviews(restaurantId, initialReviews);
  // 인라인 수정은 한 번에 하나만
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="px-5 flex-1 relative flex flex-col gap-3">
      <h3 className="text-xl font-semibold">리뷰</h3>
      {reviews.length === 0 ? (
        <div className={EMPTY_CLS}>
          <Icons name="drawer-empty" size={36} w="bold" />
          <p>작성된 리뷰가 없어요</p>
        </div>
      ) : (
        <ul className={REVIEWS_CLS}>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              restaurantId={restaurantId}
              restaurantAuthorId={restaurantAuthorId}
              isEditing={editingId === review.id}
              onEditChange={(editing) =>
                setEditingId(editing ? review.id : null)
              }
            />
          ))}
        </ul>
      )}
      <ReviewComposer restaurantId={restaurantId} />
    </div>
  );
}

export default RestaurantReview;
