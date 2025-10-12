import { NextResponse } from "next/server";
import { db, restaurants, users } from "@/lib/drizzle";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("GET /api/restaurants 시작 (Drizzle)");
    console.log("DATABASE_URL 존재:", !!process.env.DATABASE_URL);

    // Drizzle을 사용한 쿼리 (필요한 필드들 추가)
    console.log("Drizzle로 restaurant 조회 시작");
    const restaurantList = await db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        address: restaurants.address,
        latitude: restaurants.latitude,
        longitude: restaurants.longitude,
        price: restaurants.price,
        topokkiType: restaurants.topokkiType,
        riceKinds: restaurants.riceKinds,
        spiciness: restaurants.spiciness,
        reviewCount: restaurants.reviewCount,
        averageRating: restaurants.averageRating,
        createdAt: restaurants.createdAt,
      })
      .from(restaurants)
      .orderBy(desc(restaurants.createdAt))
      .limit(10);

    console.log("조회된 맛집 수:", restaurantList.length);
    return NextResponse.json(restaurantList);
  } catch (error) {
    console.error("맛집 조회 오류:", error);
    console.error(
      "오류 상세:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "오류 스택:",
      error instanceof Error ? error.stack : "No stack",
    );

    return NextResponse.json(
      {
        message: "맛집 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    // 쿠키에서 사용자 인증 정보 추출
    const authUser = await getAuthenticatedUser();

    // DB에서 사용자 정보 조회하거나 생성 (Drizzle 사용)
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);

    if (user.length === 0) {
      // 사용자가 없으면 자동 생성
      const newUser = await db
        .insert(users)
        .values({
          id: authUser.id,
          email: authUser.email!,
          name:
            authUser.user_metadata?.name ||
            authUser.user_metadata?.full_name ||
            null,
          avatar: authUser.user_metadata?.avatar_url || null,
          provider: authUser.app_metadata?.provider || "unknown",
          providerId: authUser.id,
        })
        .returning();

      user = newUser;
    }

    // POST 기능은 일단 간단하게 처리
    return NextResponse.json(
      { error: "POST 기능은 아직 구현 중입니다." },
      { status: 501 },
    );
  } catch (error) {
    console.error("맛집 생성 오류:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "맛집 등록에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
