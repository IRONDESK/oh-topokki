import React, { useEffect, useRef, useState } from "react";
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
  "inline-flex items-center gap-[3px] rounded-lg px-1.5 py-[1px] bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium";

const INPUT_CONTAINER_CLS =
  "sticky left-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] -mx-1 w-[calc(100%+8px)] min-h-[60px]";
const INPUT_BOX_CLS =
  "flex items-center bg-white rounded-chip w-full h-12 pl-4 pr-2.5 shadow-sticker-sm [transition:border_0.15s] border-[1.5px] border-ink has-[input:focus]:border-primary-500 has-[input:disabled]:bg-gray-100";

function RestaurantReview({ initialReviews, restaurantId, initial }: Props) {
  const [reviewInput, setReviewInput] = useState("");
  const [rating, setRating] = useState(0); // 필수값 — 1점 이상 선택해야 submit 가능
  const [showRating, setShowRating] = useState(false);
  const inputFocusedRef = useRef(false);
  const { user } = useAuth();
  const { data: reviews } = useReviews(restaurantId, initialReviews);
  const { mutate, isPending } = useCreateReview();

  // 로그인 리뷰는 별점(1+)까지 있어야 제출 가능, 익명은 내용만 있으면 됨
  const canSubmit = !!reviewInput.trim() && (!user || rating >= 1);

  // 별점 UI가 떠 있는 동안, input 밖에서 상세 화면이 스크롤되면 자연스럽게 닫는다.
  useEffect(() => {
    if (!showRating) return;
    const onAnyScroll = () => {
      if (!inputFocusedRef.current) setShowRating(false);
    };
    // scroll은 버블링되지 않으므로 capture로 내부 스크롤 컨테이너까지 감지
    document.addEventListener("scroll", onAnyScroll, true);
    return () => document.removeEventListener("scroll", onAnyScroll, true);
  }, [showRating]);

  const updateNewReview = () => {
    if (!canSubmit) return;

    mutate(
      {
        restaurantId,
        json: {
          content: reviewInput,
          // 별점은 로그인 사용자만 부여, 비로그인은 의견만 전송
          ...(user ? { rating } : {}),
        },
      },
      {
        onSuccess: () => {
          setReviewInput("");
          setRating(0);
          setShowRating(false);
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
                    {review.author
                      ? `${review.author.nickname}님`
                      : `${review.guestNickname}(${review.guestIpPrefix})님`}
                  </span>
                  <span className={BULLET_CLS} />
                  <span className="font-normal text-gray-400">
                    {!isThisYear(review.createdAt) &&
                      getYear(review.createdAt) + "년 "}
                    {format(review.createdAt, "M월 d일 HH:mm")}
                  </span>
                  {review.authorId != null &&
                    review.authorId === initial.authorId && (
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
              {review.rating != null && review.authorId !== initial.authorId && (
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
        {user && (
          <div
            data-visible={showRating}
            className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 rounded-chip bg-white/95 backdrop-blur-[3px] px-4 py-2.5 shadow-lg [transition:opacity_0.25s,translate_0.25s] data-[visible=false]:opacity-0 data-[visible=false]:translate-y-2 data-[visible=false]:pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
          >
            <span className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`별점 ${n}점`}
                  className="cursor-pointer p-1"
                >
                  <Icons
                    name="star"
                    w={n <= rating ? "solid" : "regular"}
                    t="round"
                    size={28}
                    color={
                      n <= rating
                        ? "var(--color-primary-500)"
                        : "var(--color-gray-300)"
                    }
                  />
                </button>
              ))}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {rating > 0 ? RATING_MESSAGE[rating] : "별점을 선택해주세요"}
            </span>
          </div>
        )}
        <div className={INPUT_BOX_CLS}>
          <InputHead
            type="text"
            placeholder={
              user
                ? "300자 이내의 리뷰를 남겨주세요"
                : "익명으로 의견을 남길 수 있어요 (별점은 로그인 후 가능)"
            }
            fontSize="body3"
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
            onFocus={() => {
              inputFocusedRef.current = true;
              if (user) setShowRating(true);
            }}
            onBlur={() => {
              inputFocusedRef.current = false;
            }}
          />
          {isPending ? (
            <Spinner color="primary" thick={3} size={28} />
          ) : (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={updateNewReview}
              aria-label="리뷰 제출"
            >
              <Icons
                name="arrow-circle-up"
                t="round"
                w="solid"
                color={
                  canSubmit
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
