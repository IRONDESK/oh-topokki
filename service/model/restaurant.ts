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
  _count: {
    reviews: number;
  };
};

type ResponseReview = {
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
