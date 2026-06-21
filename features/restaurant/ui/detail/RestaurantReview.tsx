import React, { useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { format, getYear, isThisYear } from "date-fns";

import Icons from "@/shared/ui/Icons";
import { InputHead } from "@/shared/ui/InputHead";
import { ResponseReview } from "@/shared/api/model/restaurant";
import { useCreateReview, useReviews } from "@/features/review/api/use-review";
import { dialog } from "@/shared/ui/feature/dialog";
import Spinner from "@/shared/ui/Spinner";

type Props = {
  initialReviews: ResponseReview[];
  restaurantId: string;
  initial: { createAt: string; authorId: string };
};

const CONTAINER_CLS = "px-5 flex-1 relative flex flex-col gap-3";
const EMPTY_CLS =
  "mt-10 mb-16 mx-auto flex flex-col items-center gap-2 text-gray-500 text-base font-medium";
const REVIEWS_CLS =
  "flex flex-col gap-8 my-1.5 mb-[calc(env(safe-area-inset-bottom)+32px)] pb-4 text-gray-700 text-sm font-normal";
const REVIEW_ITEM_CLS = "flex flex-col gap-1";
const BULLET_CLS =
  "shrink-0 inline-block w-[3px] h-[3px] rounded-full bg-gray-300";
const RATING_LABEL_CLS =
  "inline-flex items-center gap-[3px] rounded-[4px] px-1 py-[1px] bg-primary-50 text-primary-600 text-xs font-medium";

const INPUT_CONTAINER_CLS =
  "sticky left-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] -mx-1 w-[calc(100%+8px)] min-h-[60px]";
const INPUT_BOX_CLS =
  "flex items-center bg-white/75 rounded-[32px] w-full h-12 pl-4 pr-2.5 shadow-md backdrop-blur-[2px] [transition:border_0.2s] border border-transparent has-[input:focus]:border-primary-300 has-[input:disabled]:bg-gray-100";

function RestaurantReview({ initialReviews, restaurantId, initial }: Props) {
  const [reviewInput, setReviewInput] = useState("");
  const { user } = useAuth();
  const { data: reviews } = useReviews(restaurantId, initialReviews);
  const { mutate, isPending } = useCreateReview();

  const updateNewReview = () => {
    mutate(
      {
        restaurantId,
        json: {
          content: reviewInput,
          rating: 5,
        },
      },
      {
        onSuccess: () => {
          setReviewInput("");
          dialog.alert({ title: "리뷰를 추가했습니다." });
        },
      },
    );
  };

  return (
    <div className={CONTAINER_CLS}>
      <h3 className="text-xl font-semibold">리뷰</h3>
      {reviews.length === 0 && (
        <div className={EMPTY_CLS}>
          <Icons name="drawer-empty" size={36} w="bold" t="round" />
          <p>작성된 리뷰가 없어요</p>
        </div>
      )}

      {reviews.length > 0 && (
        <ul className={REVIEWS_CLS}>
          {reviews.map((review) => (
            <li key={review.id} className={REVIEW_ITEM_CLS}>
              <p className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span className="font-medium text-gray-500">
                    {review.author.name}님
                  </span>
                  <span className={BULLET_CLS} />
                  <span className="font-normal text-gray-400">
                    {!isThisYear(review.createdAt) &&
                      getYear(review.createdAt) + "년 "}
                    {format(review.createdAt, "M월 d일 HH:mm")}
                  </span>
                  {review.authorId === initial.authorId && (
                    <>
                      <span className={BULLET_CLS} />
                      <span className="font-medium text-primary-400">
                        소개한 사람
                      </span>
                    </>
                  )}
                </span>
              </p>
              <p className="text-base">{review.content}</p>
              {review.authorId !== initial.authorId && (
                <p style={{ marginTop: "4px" }}>
                  <span className={RATING_LABEL_CLS}>
                    <Icons
                      name="social-network"
                      w="solid"
                      t="straight"
                      size={14}
                    />
                    {RATING_MESSAGE[review.rating]}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className={INPUT_CONTAINER_CLS}>
        <div className={INPUT_BOX_CLS}>
          <InputHead
            type="text"
            disabled={!user}
            placeholder={
              user
                ? "300자 이내의 리뷰를 남겨주세요"
                : "로그인 후 작성할 수 있어요"
            }
            fontSize="body3"
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
          />
          {isPending ? (
            <Spinner color="primary" thick={3} size={28} />
          ) : (
            <button
              type="button"
              disabled={!user}
              onClick={updateNewReview}
              aria-label="리뷰 제출"
            >
              <Icons
                name="arrow-circle-up"
                t="round"
                w="solid"
                color={
                  user
                    ? "var(--color-primary-500)"
                    : "var(--color-gray-300)"
                }
                size={28}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const RATING_MESSAGE: Record<number, string> = {
  1: "아쉬워요",
  2: "평범해요",
  3: "근처라면 가볼만 해요",
  4: "시간내서 꼭 가보세요",
  5: "멀어도 꼭 가보세요",
};

export default RestaurantReview;
