import { NextRequest, NextResponse } from "next/server";
import { db, restaurants, users, reviews } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 레스토랑 기본 정보 조회
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, id))
      .limit(1);

    if (restaurant.length === 0) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 작성자 정보 조회
    const author = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, restaurant[0].authorId))
      .limit(1);

    // 리뷰 정보 조회
    const restaurantReviews = await db
      .select({
        id: reviews.id,
        content: reviews.content,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
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

    // 결과 조합
    const result = {
      ...restaurant[0],
      author: author[0] || null,
      reviews: restaurantReviews,
      _count: {
        reviews: restaurantReviews.length,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("맛집 조회 오류:", error);
    return NextResponse.json(
      { message: "맛집 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      address,
      latitude,
      longitude,
      phoneNumber,
      topokkiType,
      price,
      riceKinds = [],
      sauceKinds = [],
      spiciness,
      canChangeSpicy,
      sideMenus = [],
      noodleKinds = [],
      sundaeType,
      others = [],
      recommend = [],
    } = body;

    // 맛집 정보 업데이트
    const updateData: any = {
      name,
      address,
      phoneNumber,
      topokkiType,
      sundaeType,
      riceKinds,
      sauceKinds,
      canChangeSpicy,
      sideMenus,
      noodleKinds,
      others,
      recommend,
    };

    if (latitude) updateData.latitude = parseFloat(latitude);
    if (longitude) updateData.longitude = parseFloat(longitude);
    if (price) updateData.price = parseInt(price);
    if (spiciness !== undefined) updateData.spiciness = parseInt(spiciness);

    const updatedRestaurant = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, id))
      .returning();

    if (updatedRestaurant.length === 0) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 작성자 정보 조회
    const author = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, updatedRestaurant[0].authorId))
      .limit(1);

    const result = {
      ...updatedRestaurant[0],
      author: author[0] || null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("맛집 수정 오류:", error);
    return NextResponse.json(
      { message: "맛집 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deletedRestaurant = await db
      .delete(restaurants)
      .where(eq(restaurants.id, id))
      .returning();

    if (deletedRestaurant.length === 0) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "맛집이 삭제되었습니다." });
  } catch (error) {
    console.error("맛집 삭제 오류:", error);
    return NextResponse.json(
      { message: "맛집 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
