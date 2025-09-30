'use client';

import { useEffect, useState } from 'react';
import Icons from '@/share/components/Icons';
import * as styles from './RestaurantModal.css';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
  topokkiType?: string;
  price?: number;
  sundaeType?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  riceKinds: Array<{
    id: string;
    name: string;
  }>;
  sauceKinds: Array<{
    id: string;
    name: string;
    spicyLevel?: number;
  }>;
  sideMenus: Array<{
    id: string;
    name: string;
  }>;
  noodleKinds: Array<{
    id: string;
    name: string;
  }>;
  others: Array<{
    id: string;
    name: string;
  }>;
  reviews?: Array<{
    id: string;
    content: string;
    rating: number;
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onWriteReview?: (restaurantId: string) => void;
}

const RestaurantModal = ({ restaurant, isOpen, onClose, onWriteReview }: RestaurantModalProps) => {
  const [detailData, setDetailData] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && restaurant) {
      loadRestaurantDetails(restaurant.id);
    }
  }, [isOpen, restaurant]);

  const loadRestaurantDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurants/${id}`);
      if (!response.ok) throw new Error('데이터 로딩 실패');
      const data = await response.json();
      setDetailData(data);
    } catch (error) {
      console.error('맛집 상세 정보 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '가격 정보 없음';
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen || !restaurant) return null;

  const data = detailData || restaurant;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{data.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Icons w="regular" t="straight" name="cross" size={20} />
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <p>상세 정보를 불러오는 중...</p>
          </div>
        ) : (
          <div className={styles.content}>
            {/* 기본 정보 */}
            <section className={styles.section}>
              <div className={styles.basicInfo}>
                <div className={styles.rating}>
                  <Icons w="solid" t="straight" name="star" size={20} />
                  <span>{data.averageRating.toFixed(1)}</span>
                  <span className={styles.reviewCount}>({data.reviewCount}개 리뷰)</span>
                </div>
                <p className={styles.address}>
                  <Icons w="regular" t="straight" name="marker" size={16} />
                  {data.address}
                </p>
                {data.phoneNumber && (
                  <p className={styles.phone}>
                    <Icons w="regular" t="straight" name="phone-call" size={16} />
                    {data.phoneNumber}
                  </p>
                )}
                <div className={styles.author}>
                  등록자: {data.author?.name || '알 수 없음'}
                </div>
              </div>
            </section>

            {/* 떡볶이 종류 */}
            {data.topokkiType && (
              <section className={styles.section}>
                <h3>떡볶이 종류</h3>
                <span className={styles.tag}>{data.topokkiType}</span>
              </section>
            )}

            {/* 가격 정보 */}
            <section className={styles.section}>
              <h3>가격 정보</h3>
              <p className={styles.price}>{formatPrice(data.price)}</p>
            </section>

            {/* 떡볶이 정보 */}
            <div className={styles.topokkiInfo}>
              {data.riceKinds.length > 0 && (
                <section className={styles.section}>
                  <h3>떡 종류</h3>
                  <div className={styles.tags}>
                    {data.riceKinds.map((rice) => (
                      <span key={rice.id} className={styles.tag}>
                        {rice.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.sauceKinds.length > 0 && (
                <section className={styles.section}>
                  <h3>소스 종류</h3>
                  <div className={styles.tags}>
                    {data.sauceKinds.map((sauce) => (
                      <span key={sauce.id} className={styles.tag}>
                        {sauce.name}
                        {sauce.spicyLevel && (
                          <span className={styles.spicyLevel}>
                            {' 🌶'.repeat(sauce.spicyLevel)}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.sideMenus.length > 0 && (
                <section className={styles.section}>
                  <h3>사이드 메뉴</h3>
                  <div className={styles.tags}>
                    {data.sideMenus.map((menu) => (
                      <span key={menu.id} className={styles.tag}>
                        {menu.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.noodleKinds.length > 0 && (
                <section className={styles.section}>
                  <h3>면 종류</h3>
                  <div className={styles.tags}>
                    {data.noodleKinds.map((noodle) => (
                      <span key={noodle.id} className={styles.tag}>
                        {noodle.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.others && data.others.length > 0 && (
                <section className={styles.section}>
                  <h3>기타</h3>
                  <div className={styles.tags}>
                    {data.others.map((other) => (
                      <span key={other.id} className={styles.tag}>
                        {other.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.sundaeType && (
                <section className={styles.section}>
                  <h3>순대</h3>
                  <span className={styles.tag}>{data.sundaeType}</span>
                </section>
              )}
            </div>

            {/* 리뷰 섹션 */}
            <section className={styles.section}>
              <div className={styles.reviewHeader}>
                <h3>리뷰</h3>
                {onWriteReview && (
                  <button
                    className={styles.writeReviewButton}
                    onClick={() => onWriteReview(data.id)}
                  >
                    리뷰 작성
                  </button>
                )}
              </div>
              
              {data.reviews && data.reviews.length > 0 ? (
                <div className={styles.reviews}>
                  {data.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAuthor}>
                          {review.author.avatar ? (
                            <img 
                              src={review.author.avatar} 
                              alt={review.author.name} 
                              className={styles.avatar}
                            />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              {review.author.name.charAt(0)}
                            </div>
                          )}
                          <span>{review.author.name}</span>
                        </div>
                        <div className={styles.reviewMeta}>
                          <div className={styles.reviewRating}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <span className={styles.reviewDate}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className={styles.reviewContent}>{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noReviews}>아직 리뷰가 없습니다.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantModal;