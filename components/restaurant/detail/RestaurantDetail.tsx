import { ResponseRestaurant } from "@/service/model/restaurant";
import { detailStyle as style } from "@/components/restaurant/detail/detail.css";
import { overlayStyle } from "@/share/components/css/modal.css";
import { fonts, typo } from "@/style/typo.css";
import {
  NOODLE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
  TOPOKKI_RICE_KINDS,
  TOPOKKI_TYPE,
} from "@/constants/restaurant";
import Icons from "@/share/components/Icons";
import { flexs } from "@/style/container.css";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail } from "@/service/naver-map";
import Spinner from "@/share/components/Spinner";
import { useIsDesktop } from "@/hooks/useIsDesktop";

type Props = {
  restaurantId: string;
  restaurantName: string;
  topokkiType: string;
  price: number;
  address: string;
  controller: {
    close: () => void;
    isOpen: boolean;
    unmount: () => void;
  };
};

function RestaurantDetail(props: Props) {
  const {
    restaurantId,
    restaurantName,
    price,
    address,
    topokkiType,
    controller,
  } = props;
  const isDesktop = useIsDesktop();
  const { data: restaurant, isLoading } = useQuery({
    enabled: !!restaurantId,
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getRestaurantDetail({ restaurantId }),
  });

  const [startPos, setStartPos] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const barRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  const onClose = () => {
    if (isDesktop) {
      controller.unmount();
      return;
    }
    controller.close();
    setTimeout(controller.unmount, 300);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    // 스크롤 영역에서는 드래그 비활성화
    if (innerRef.current && innerRef.current.scrollTop > 10) {
      return;
    }
    event.stopPropagation();
    setStartPos(event.touches[0].clientY);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (event: React.TouchEvent) => {
    if (!isDragging) return;
    event.stopPropagation();
    const currentPos = event.touches[0].clientY;
    const offset = currentPos - startPos;
    setDragOffset(offset);
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!isDragging) return;
    event.stopPropagation();
    setIsDragging(false);
    setDragOffset(0);

    const endPos = event.changedTouches[0].clientY;
    const distance = startPos - endPos;

    if (distance >= 90) {
      setIsFull(true);
    } else if (distance <= -90 && isFull) {
      setIsFull(false);
    } else if (distance <= -90 && !isFull) {
      onClose();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: [1] },
    );

    const currentBarRef = barRef.current;
    if (currentBarRef && isFull) {
      observer.observe(currentBarRef);
    }

    return () => {
      if (currentBarRef) {
        observer.unobserve(currentBarRef);
      }
    };
  }, [isFull]);

  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (controller.isOpen) {
      setIsFull(isDesktop);
      body.style.overflow = "hidden";
      // body.style.pointerEvents = "none";
    }
    return () => {
      body.style.removeProperty("overflow");
      // body.style.removeProperty("pointer-events");
    };
  }, [controller.isOpen]);

  return (
    <>
      <div
        className={overlayStyle.dim}
        onClick={onClose}
        style={{ overflow: "hidden", backgroundColor: "transparent" }}
      ></div>
      <section
        className={style.container}
        data-open={controller.isOpen}
        data-full={isFull}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: isDragging
            ? `translate3d(-50%, ${
                isFull
                  ? Math.max(0, dragOffset * 0.3)
                  : Math.max(0, Math.min(35 + dragOffset * 0.3, 98))
              }vh, 0)`
            : undefined,
          transition: isDragging ? "none" : undefined,
        }}
      >
        <div
          ref={innerRef}
          style={{
            overflowY: isFull ? "auto" : "visible",
            height: isFull ? "99.9dvh" : "auto",
            WebkitOverflowScrolling: "touch", // iOS 스크롤 지원
          }}
        >
          {isDesktop ? (
            <div ref={barRef} className={style.closeBtn}>
              <button type="button" onClick={onClose}>
                <Icons name="cross" w="bold" size={20} t="round" />
              </button>
            </div>
          ) : (
            <div className={style.bar} ref={barRef} />
          )}
          <div className={style.contents}>
            <div
              className={clsx(style.stickyArea, style.innerPadding)}
              data-sticky={isSticky}
            >
              <p className={style.topokkiType} data-sticky={isSticky}>
                {isSticky
                  ? TOPOKKI_TYPE_ABBR[topokkiType]
                  : TOPOKKI_TYPE[topokkiType]}
              </p>
              <h2
                className={clsx({
                  [fonts.body1.semibold]: !isSticky,
                  [fonts.body2.medium]: isSticky,
                })}
              >
                {restaurantName}
              </h2>
              <p
                className={typo({
                  size: "caption1",
                  weight: "regular",
                  color: "gray400",
                })}
                style={{ display: isSticky ? "none" : "block" }}
              >
                {address}
              </p>
            </div>
            <p className={clsx(style.price, style.innerPadding)}>
              <span className={fonts.head6.semibold}>
                {price?.toLocaleString()}원
              </span>
              <span
                className={typo({
                  size: "body4",
                  weight: "regular",
                  color: "gray600",
                })}
              >
                1인당, 기본
              </span>
            </p>
            {isLoading && (
              <div className={style.loadingContainer}>
                <Spinner size={32} thick={3} />
              </div>
            )}
            {restaurant && !isLoading && (
              <dl className={clsx(style.detailItems, style.innerPadding)}>
                <dt>떡 종류</dt>
                <dd>
                  {restaurant.riceKinds.map((kind) => (
                    <span key={kind}>{TOPOKKI_RICE_KINDS[kind]}</span>
                  ))}
                </dd>
                <dt>소스 종류</dt>
                <dd>
                  {restaurant.sauceKinds.map((kind) => (
                    <span key={kind}>{SAUCE_TYPE[kind]}</span>
                  ))}
                </dd>
                {restaurant.noodleKinds.length > 0 && (
                  <>
                    <dt>면 종류</dt>
                    <dd>
                      {restaurant.noodleKinds.map((kind) => (
                        <span key={kind}>{NOODLE_TYPE[kind]}</span>
                      ))}
                    </dd>
                  </>
                )}
                <dt>매운 정도</dt>
                <dd>
                  <p className={flexs({ gap: "4", justify: "start" })}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <span
                        key={index}
                        className={style.spicy}
                        data-active={restaurant.spiciness >= index}
                      >
                        <Icons name="pepper" w="solid" size={18} />
                      </span>
                    ))}
                  </p>
                  <p
                    className={typo({
                      size: "body4",
                      weight: "medium",
                      color: "primary500",
                    })}
                  >
                    {SPICINESS_DESCRIPTION[restaurant.spiciness]}
                  </p>
                </dd>
                <dt>순대</dt>
                <dd>
                  {restaurant.sundaeType
                    ? SUNDAE_TYPE[restaurant.sundaeType]
                    : "순대는 없어요"}
                </dd>
                <dt>사이드메뉴</dt>
                <dd
                  className={flexs({ gap: "6", justify: "start", wrap: true })}
                >
                  {restaurant.sideMenus.map((menu) => (
                    <span key={menu} className={style.sidemenu}>
                      {SIDE_MENU_TYPE[menu]}
                    </span>
                  ))}
                </dd>
                <dt>기타</dt>
                <dd
                  className={flexs({ gap: "6", justify: "start", wrap: true })}
                >
                  {restaurant.others.map((menu) => (
                    <span key={menu} className={style.sidemenu}>
                      {menu}
                    </span>
                  ))}
                </dd>
              </dl>
            )}
            <div className={style.divider} />
            <div
              className={clsx(
                style.innerPadding,
                flexs({ dir: "col", gap: "12", align: "start" }),
              )}
            >
              <h3
                className={typo({
                  size: "body1",
                  weight: "semibold",
                })}
              >
                리뷰
              </h3>
              <div className={style.headReview}>
                <p className={style.headReviewText}>
                  {
                    restaurant?.reviews.find(
                      (review) => review.authorId === restaurant.authorId,
                    )?.content
                  }
                </p>
                <p
                  className={typo({
                    size: "caption1",
                    color: "gray500",
                  })}
                >
                  작성자의 한줄평
                </p>
              </div>

              <ul>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li> <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li> <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li> <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li> <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
                <li>리뷰 테스트</li>
                <li>리뷰테스트</li>
              </ul>
            </div>
            <div className={style.bottomPosition} />
          </div>
        </div>
      </section>
    </>
  );
}

const SPICINESS_DESCRIPTION: Record<string, string> = {
  0: "외국인도 누구나 즐겨요",
  1: "진라면 정도로 매워요",
  2: "신라면 정도로 매워요",
  3: "신라면보다 약간 더 매워요",
  4: "불닭볶음면 정도로 매워요",
  5: "불닭보다 훨씬 매워요",
};

const TOPOKKI_TYPE_ABBR: Record<string, string> = {
  ontable: "즉떡",
  pan: "판떡",
  soup: "국물",
};

export default RestaurantDetail;
