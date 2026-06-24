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
  rating: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  restaurantId: string;
  author: ResponseAuthor;
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
    rating: number;
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
