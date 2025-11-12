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
  riceKinds: string[];
  sauceKinds: string[];
  spiciness: number;
  canChangeSpicy: boolean;
  sideMenus: string[];
  noodleKinds: string[];
  sundaeType: string | null;
  others: string[];
  recommend: string[];
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
  name: string;
  avatar: string;
};

export type RequestNewReview = {
  restaurantId: string;
  json: {
    content: string;
    rating: number;
  };
};

export type RequestAddFavorite = {
  restaurantId: string;
  memo?: string;
};
