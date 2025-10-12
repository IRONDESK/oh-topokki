import { NextRequest, NextResponse } from "next/server";
import { db, restaurants, users, reviews } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const reviewList = await db
      .select({
        id: reviews.id,
        content: reviews.content,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        authorId: reviews.authorId,
        restaurantId: reviews.restaurantId,
        author: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.authorId, users.id))
      .where(eq(reviews.restaurantId, id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(reviewList);
  } catch (error) {
    console.error("리뷰 조회 오류:", error);
    return NextResponse.json(
      { message: "리뷰 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // 쿠키에서 사용자 인증 정보 추출
    const authUser = await getAuthenticatedUser();

    // DB에서 사용자 정보 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { message: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요." },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { content, rating } = body;

    if (!content || !rating) {
      return NextResponse.json(
        { message: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "별점은 1-5 사이의 값이어야 합니다." },
        { status: 400 },
      );
    }

    // 리뷰 생성
    const newReview = await db
      .insert(reviews)
      .values({
        content,
        rating: parseInt(rating),
        authorId: user[0].id,
        restaurantId: id,
      })
      .returning();

    // 작성자 정보 조회
    const author = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, user[0].id))
      .limit(1);

    // 맛집의 평균 별점과 리뷰 개수 업데이트
    const allReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.restaurantId, id));

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const reviewCount = allReviews.length;

    await db
      .update(restaurants)
      .set({
        averageRating,
        reviewCount,
      })
      .where(eq(restaurants.id, id));

    // 응답 구성
    const result = {
      ...newReview[0],
      author: author[0] || null,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("리뷰 생성 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "리뷰 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
