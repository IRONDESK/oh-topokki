import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { useCreateReview } from "@/features/review/api/use-review";
import { RATING_MESSAGE } from "@/shared/constants/restaurant";
import { dialog } from "@/shared/ui/feature/dialog";
import Icons from "@/shared/ui/Icons";
import { InputHead } from "@/shared/ui/InputHead";
import Spinner from "@/shared/ui/Spinner";
import StarRating from "@/shared/ui/StarRating";

const INPUT_CONTAINER_CLS =
  "sticky left-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] -mx-1 w-[calc(100%+8px)] min-h-[60px]";
const INPUT_BOX_CLS =
  "flex items-center bg-white rounded-chip w-full h-12 pl-4 pr-2.5 shadow-sticker-sm [transition:border_0.15s] border-[1.5px] border-ink has-[input:focus]:border-primary-500 has-[input:disabled]:bg-gray-100";
const RATING_POPOVER_CLS =
  "absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 rounded-chip bg-white/95 backdrop-blur-[3px] px-4 py-2.5 shadow-lg [transition:opacity_0.25s,translate_0.25s] data-[visible=false]:opacity-0 data-[visible=false]:translate-y-2 data-[visible=false]:pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0";

/** 하단 고정 리뷰 입력창. 로그인 사용자는 포커스 시 별점 선택 UI가 뜬다. */
export default function ReviewComposer({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0); // 로그인 리뷰는 1점 이상 필수
  const [hoverRating, setHoverRating] = useState(0); // hover 중인 별점 문구 미리보기
  const [showRating, setShowRating] = useState(false);
  const inputFocusedRef = useRef(false);
  const { mutate: createReview, isPending } = useCreateReview();

  // 로그인 리뷰는 별점(1+)까지 있어야 제출 가능, 익명은 내용만 있으면 됨
  const canSubmit = !!content.trim() && (!user || rating >= 1);

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

  const submit = () => {
    if (!canSubmit) return;

    createReview(
      {
        restaurantId,
        // 별점은 로그인 사용자만 부여, 비로그인은 의견만 전송
        json: { content, ...(user ? { rating } : {}) },
      },
      {
        onSuccess: () => {
          setContent("");
          setRating(0);
          setShowRating(false);
          dialog.alert({ title: "리뷰를 추가했습니다." });
        },
      },
    );
  };

  return (
    <div className={INPUT_CONTAINER_CLS}>
      {user && (
        <div data-visible={showRating} className={RATING_POPOVER_CLS}>
          <StarRating
            value={rating}
            onChange={setRating}
            onHover={setHoverRating}
            size={28}
            className="gap-1 [&>button]:p-1"
          />
          {/* hover 중엔 해당 별점 문구 미리보기(회색), 선택하면 문구·색(primary) 고정 */}
          <span
            className={
              hoverRating > 0 && hoverRating !== rating
                ? "text-xs font-medium text-gray-400"
                : rating > 0
                  ? "text-xs font-medium text-primary-500"
                  : "text-xs font-medium text-gray-500"
            }
          >
            {hoverRating > 0
              ? RATING_MESSAGE[hoverRating]
              : rating > 0
                ? RATING_MESSAGE[rating]
                : "별점을 선택해주세요"}
          </span>
        </div>
      )}
      <div className={INPUT_BOX_CLS}>
        <InputHead
          type="text"
          placeholder={
            user
              ? "300자 이내의 리뷰를 남겨주세요"
              : "익명으로 의견 남기기 (별점은 로그인 필요)"
          }
          fontSize="body3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            onClick={submit}
            aria-label="리뷰 제출"
          >
            <Icons
              name="arrow-circle-up"
              w="solid"
              size={28}
              color={
                canSubmit ? "var(--color-primary-500)" : "var(--color-gray-300)"
              }
            />
          </button>
        )}
      </div>
    </div>
  );
}
