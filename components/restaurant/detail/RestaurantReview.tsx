import React, { useState } from "react";
import clsx from "clsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { format, getYear, isSameDay, isThisYear } from "date-fns";

import Icons from "@/share/components/Icons";
import { typo } from "@/style/typo.css";
import { InputHead } from "@/share/components/InputHead";
import { theme } from "@/style/theme.css";
import { detailStyle as style } from "@/components/restaurant/detail/detail.css";
import { ResponseReview } from "@/service/model/restaurant";
import { getRestaurantReview, postRestaurantReview } from "@/service/naver-map";
import { overlay } from "@/share/components/feature/overlay";
import Spinner from "@/share/components/Spinner";
import { flexs } from "@/style/container.css";

type Props = {
  initialReviews: ResponseReview[];
  restaurantId: string;
  initial: { createAt: string; authorId: string };
};
function RestaurantReview({ initialReviews, restaurantId, initial }: Props) {
  const [reviewInput, setReviewInput] = useState("");
  const { user } = useAuth();
  const initialReview = initialReviews.find(
    (review) =>
      isSameDay(review.createdAt, initial.createAt) &&
      review.authorId === initial.authorId,
  )?.content;

  const { data: reviews, refetch } = useQuery({
    queryKey: ["getReviews", restaurantId],
    queryFn: () => getRestaurantReview(restaurantId),
    initialData: initialReviews,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: postRestaurantReview,
  });

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
        onSuccess: async () => {
          await refetch();
          overlay.alert({ title: "리뷰를 추가했습니다." });
        },
      },
    );
  };

  return (
    <div className={clsx(style.innerPadding, style.reviewContainer)}>
      <h3
        className={typo({
          size: "body1",
          weight: "semibold",
        })}
      >
        리뷰
      </h3>
      {initialReview && (
        <div className={style.headReview}>
          <p
            className={typo({
              size: "body4",
              color: "gray500",
            })}
          >
            이 가게를 처음으로 소개한 사람은
          </p>
          <p className={style.headReviewText}>{initialReview}</p>
          <p
            className={typo({
              size: "body4",
              color: "gray500",
            })}
          >
            라고 이 가게를 평했어요.
          </p>
        </div>
      )}
      {reviews.length - 1 <= 0 && (
        <div className={style.emptyReview}>
          <Icons name="drawer-empty" size={36} w="bold" t="round" />
          <p>작성된 리뷰가 없어요</p>
        </div>
      )}

      {reviews.length - 1 > 0 && (
        <ul className={style.reviews}>
          {reviews.map((review) => (
            <li key={review.id} className={style.reviewItem}>
              <p
                className={flexs({
                  justify: "spb",
                })}
              >
                <span
                  className={flexs({
                    align: "center",
                    gap: "4",
                  })}
                >
                  <span
                    className={typo({
                      weight: "medium",
                      color: "gray500",
                    })}
                  >
                    {review.author.name}님
                  </span>
                  <span className={style.bullet} />
                  <span
                    className={typo({
                      weight: "regular",
                      color: "gray400",
                    })}
                  >
                    {!isThisYear(review.createdAt) &&
                      getYear(review.createdAt) + "년 "}
                    {format(review.createdAt, "M월 d일 HH:mm")}
                  </span>
                  {review.authorId === initial.authorId && (
                    <>
                      <span className={style.bullet} />
                      <span
                        className={typo({
                          weight: "medium",
                          color: "primary400",
                        })}
                      >
                        소개한 사람
                      </span>
                    </>
                  )}
                </span>
              </p>
              <p
                className={typo({
                  size: "body3",
                })}
              >
                {review.content}
              </p>
              <p style={{ marginTop: "4px" }}>
                <span className={style.ratingLabel}>
                  <Icons
                    name="social-network"
                    w="solid"
                    t="straight"
                    size={14}
                  />
                  {RATING_MESSAGE[review.rating]}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className={style.reviewInputContainer}>
        <div className={style.reviewInputBox}>
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
                  user ? theme.color.primary["500"] : theme.color.gray["300"]
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
