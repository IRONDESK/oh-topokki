import React, { useState } from "react";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

import Icons from "@/share/components/Icons";
import { typo } from "@/style/typo.css";
import { InputHead } from "@/share/components/InputHead";
import { theme } from "@/style/theme.css";
import { detailStyle as style } from "@/components/restaurant/detail/detail.css";
import { ResponseReview } from "@/service/model/restaurant";
import { postRestaurantReview } from "@/service/naver-map";
import { overlay } from "@/share/components/feature/overlay";
import Spinner from "@/share/components/Spinner";

type Props = {
  reviews: ResponseReview[];
  initialAuthorId: string;
  restaurantId: string;
};
function RestaurantReview({ reviews, restaurantId, initialAuthorId }: Props) {
  const [reviewInput, setReviewInput] = useState("");
  const { user } = useAuth();
  const initialReview = reviews.find(
    (review) => review.authorId === initialAuthorId,
  )?.content;

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
      <div className={style.headReview}>
        <p
          className={typo({
            size: "body4",
            color: "gray500",
          })}
        >
          이 가게를 처음으로 소개한 작성자는
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
      {reviews.length - 1 === 0 && (
        <div className={style.emptyReview}>
          <Icons name="drawer-empty" size={36} w="bold" t="round" />
          <p>작성된 리뷰가 없어요</p>
        </div>
      )}

      {reviews.length - 1 > 0 && (
        <ul className={style.reviews}>
          {reviews.map((review) => (
            <li key={review.id}>{review.content}</li>
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

export default RestaurantReview;
