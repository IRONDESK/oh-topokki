import { pgTable, text, timestamp, real, integer, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  avatar: text('avatar'),
  provider: text('provider').notNull(),
  providerId: text('providerId').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  phoneNumber: text('phoneNumber'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),

  // 작성자 정보
  authorId: text('authorId').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // 떡볶이 관련 정보
  topokkiType: text('topokkiType'), // '즉석떡볶이', '판떡볶이', '국물떡볶이'
  price: integer('price'), // 단일 가격
  riceKinds: text('riceKinds').array().default([]), // ['밀떡', '쌀떡', '가래떡']
  sauceKinds: text('sauceKinds').array().default([]), // ['달콤', '매콤', '불맛']
  spiciness: integer('spiciness'), // 맵기 정도 (0-5)
  canChangeSpicy: boolean('canChangeSpicy').default(false), // 맵기 조절 가능 여부
  sideMenus: text('sideMenus').array().default([]),
  noodleKinds: text('noodleKinds').array().default([]), // ['라면', '쫄면', '우동면', '중국당면']
  sundaeType: text('sundaeType'), // '순대만', '기본내장', '모든내장'
  others: text('others').array().default([]), // 기타 속성들
  recommend: json('recommend').default([]), // [{type: string(4글자), url: string}]

  // 평점 (계산된 값)
  averageRating: real('averageRating').default(0),
  reviewCount: integer('reviewCount').default(0),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(), // 1-5 별점
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),

  authorId: text('authorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: text('restaurantId').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  restaurants: many(restaurants),
  reviews: many(reviews),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  author: one(users, {
    fields: [restaurants.authorId],
    references: [users.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
}));