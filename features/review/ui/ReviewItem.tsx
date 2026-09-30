import { useState } from "react";
import { format, getYear, isThisYear } from "date-fns";
import { useAuth } from "@/shared/context/AuthContext";
import {
  useDeleteReview,
  useUpdateReview,
} from "@/features/review/api/use-review";
import { ResponseReview } from "@/shared/api/model/restaurant";
import { RATING_MESSAGE } from "@/shared/constants/restaurant";
import { dialog } from "@/shared/ui/feature/dialog";
import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";
import StarRating from "@/shared/ui/StarRating";

type Props = {
  review: ResponseReview;
  restaurantId: string;
  restaurantAuthorId: string | null;
  isEditing: boolean;
  onEditChange: (editing: boolean) => void;
};

const BULLET_CLS =
  "shrink-0 inline-block w-[3px] h-[3px] rounded-full bg-gray-300";
const RATING_LABEL_CLS =
  "inline-flex items-center gap-[3px] rounded-lg px-1.5 py-[1px] bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium";
const SMALL_BTN_CLS =
  "shrink-0 cursor-pointer px-2.5 py-2 rounded-lg text-sm font-medium";

/** 리뷰 한 건: 작성자/날짜/내용 표시 + 본인 리뷰 인라인 수정·삭제 */
export default function ReviewItem({
  review,
  restaurantId,
  restaurantAuthorId,
  isEditing,
  onEditChange,
}: Props) {
  const { user } = useAuth();
  const { mutate: deleteReview } = useDeleteReview();

  const isMine = !!user && review.authorId === user.id;
  // 맛집을 등록한 사람이 남긴 리뷰
  const isIntroducer =
    review.authorId != null && review.authorId === restaurantAuthorId;

  const confirmDelete = async () => {
    const ok = await dialog.confirm({
      title: "리뷰를 삭제할까요?",
      contents: "삭제한 리뷰는 되돌릴 수 없어요.",
    });
    if (ok) deleteReview({ restaurantId, reviewId: review.id });
  };

  return (
    <li className="flex flex-col gap-1">
      <p className="flex justify-between items-center">
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-500">
            {review.author
              ? `${review.author.nickname}님`
              : review.guestNickname
                ? `${review.guestNickname}(${review.guestIpPrefix})님`
                : "탈퇴한 사용자"}
          </span>
          <span className={BULLET_CLS} />
          <span className="font-normal text-gray-400">
            {!isThisYear(review.createdAt) &&
              getYear(review.createdAt) + "년 "}
            {format(review.createdAt, "M월 d일 HH:mm")}
          </span>
          {isIntroducer && (
            <>
              <span className={BULLET_CLS} />
              <span className="font-medium text-primary-400">소개한 사람</span>
            </>
          )}
        </span>
        {isMine && !isEditing && (
          <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <button
              type="button"
              onClick={() => onEditChange(true)}
              className="cursor-pointer hover:text-gray-600"
            >
              수정
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="cursor-pointer hover:text-red-500"
            >
              삭제
            </button>
          </span>
        )}
      </p>

      {isEditing ? (
        <ReviewEditor
          review={review}
          restaurantId={restaurantId}
          onDone={() => onEditChange(false)}
        />
      ) : (
        <>
          <p className="text-base">{review.content}</p>
          {review.rating != null && !isIntroducer && (
            <p className="mt-1">
              <span className={RATING_LABEL_CLS}>
                <Icons name="social-network" w="solid" t="straight" size={14} />
                {RATING_MESSAGE[review.rating]}
              </span>
            </p>
          )}
        </>
      )}
    </li>
  );
}

function ReviewEditor({
  review,
  restaurantId,
  onDone,
}: {
  review: ResponseReview;
  restaurantId: string;
  onDone: () => void;
}) {
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating ?? 0);
  const { mutate: updateReview, isPending } = useUpdateReview();

  const canSave = !!content.trim() && rating >= 1;

  const submit = () => {
    if (!canSave) return;
    updateReview(
      { restaurantId, reviewId: review.id, json: { content, rating } },
      { onSuccess: onDone },
    );
  };

  return (
    <div className="flex flex-col gap-2 mt-1">
      <span className="flex items-center gap-1.5">
        <StarRating value={rating} onChange={setRating} />
        <span className="text-xs font-medium text-gray-500">
          {rating > 0 ? RATING_MESSAGE[rating] : "별점을 선택해주세요"}
        </span>
      </span>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-w-0 rounded-lg border-[1.5px] border-gray-200 focus:border-primary-400 outline-none px-3 py-2 text-base"
        />
        {isPending ? (
          <Spinner color="primary" thick={2} size={20} />
        ) : (
          <>
            <button
              type="button"
              disabled={!canSave}
              onClick={submit}
              className={`${SMALL_BTN_CLS} text-white bg-primary-500 disabled:bg-gray-300`}
            >
              저장
            </button>
            <button
              type="button"
              onClick={onDone}
              className={`${SMALL_BTN_CLS} text-gray-500 bg-gray-100`}
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}
