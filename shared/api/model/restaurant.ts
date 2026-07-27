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

export type RequestNewReview = {
  restaurantId: string;
  json: {
    content: string;
    rating?: number; // 비로그인 리뷰는 별점 없이 전송
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
