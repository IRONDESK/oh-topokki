export type ResponseRestaurant = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  topokkiType: "ontable" | "pan" | "soup";
  price: number;
  riceTypes: string[];
  sauceTypes: string[];
  spiciness: number;
  canChangeSpicy: boolean;
  sideMenus: string[];
  noodleTypes: string[];
  sundaeType: "single" | "basic" | "various" | null;
  others: string[];
  recommend: { type: string; url: string }[];
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  author: ResponseAuthor;
  reviews: ResponseReview[];
  isFavorite: boolean | null;
  favoriteCnt: number;
  _count: {
    reviews: number;
  };
};

export type ResponseReview = {
  id: string;
  content: string;
  rating: number | null; // 익명 리뷰는 별점 없음
  createdAt: string;
  updatedAt: string;
  authorId: string | null;
  restaurantId: string;
  author: ResponseAuthor | null;
  guestNickname: string | null; // 익명 리뷰 닉네임 ("익명의...")
  guestIpPrefix: string | null; // 익명 리뷰 IP 앞 2옥텟
};

type ResponseAuthor = {
  id: string;
  nickname: string;
  image: string | null;
};

export type ResponseRankingItem = {
  id: string;
  name: string;
  viewCount: number;
  favoriteCnt: number;
  reviewCnt: number;
  unrank: boolean; // true면 활동 없는 식당을 최근 등록순으로 채운 항목
};

export type RequestNewReview = {
  restaurantId: string;
  json: {
    content: string;
    rating?: number; // 비로그인 리뷰는 별점 없이 전송
  };
};

export type RequestUpdateReview = {
  restaurantId: string;
  reviewId: string;
  json: {
    content: string;
    rating?: number;
  };
};

export type ResponseFavorite = {
  id: string;
  name: string;
  topokkiType: "ontable" | "pan" | "soup";
  riceTypes: string[];
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  addedAt: string;
  memo: string | null;
};

export type RequestAddFavorite = {
  restaurantId: string;
  memo?: string;
};

export type ResponseAddFavorite = {
  favorite: {
    addedAt: string;
    id: string;
    memo: string | null;
    name: string;
    riceTypes: string[];
    topokkiType: string;
  };
};

// 검색 필터 (GET /api/restaurants/search · /api/restaurants 공용 파라미터)
export type SearchRestaurantFilters = {
  topokkiType?: string | null;
  riceTypes?: string | null;
  sauceTypes?: string | null;
  sundaeType?: string | null;
  sideMenus?: string[] | null;
  minSpiciness?: number | null;
  maxSpiciness?: number | null;
};

// 등록/수정 폼 값 (POST/PUT body)
export type RestaurantFormData = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  topokkiType: string;
  price: number;
  riceTypes: string[];
  sauceTypes: string[];
  spiciness: number | null;
  canChangeSpicy: boolean;
  sideMenus: string[];
  noodleTypes: string[];
  sundaeType: string;
  others: string[];
  recommend: Array<{ type: string; url: string }>;
  myComment: string;
};
