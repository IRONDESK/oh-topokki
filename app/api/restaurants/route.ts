import { NextResponse } from "next/server";
import { db, restaurants, users } from "@/lib/drizzle";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/supabase-server";

// export const runtime = "edge"; // Edge Runtime에서 Neon 연결 문제로 임시 비활성화

export async function GET() {
  try {
    console.log("GET /api/restaurants 시작 (Neon Serverless)");

    // 간단한 테스트 쿼리로 연결 확인
    console.log("데이터베이스 연결 테스트 중...");
    try {
      const testResult = await db.execute(`SELECT 1 as test`);
      console.log("연결 테스트 성공:", testResult);
    } catch (testError) {
      console.error("연결 테스트 실패:", testError);
      throw new Error(`데이터베이스 연결 실패: ${testError}`);
    }

    // 테이블 존재 확인
    console.log("테이블 존재 확인 중...");
    try {
      const tableResult = await db.execute(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'restaurants'
      `);
      console.log("restaurants 테이블 확인:", tableResult);

      if (!tableResult.rows || tableResult.rows.length === 0) {
        // 테이블이 없으면 생성
        console.log("restaurants 테이블이 없습니다. 테이블을 생성합니다...");
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "restaurants" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            "name" text NOT NULL,
            "address" text NOT NULL,
            "latitude" real NOT NULL,
            "longitude" real NOT NULL,
            "phoneNumber" text,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "updatedAt" timestamp DEFAULT now() NOT NULL,
            "authorId" text NOT NULL,
            "topokkiType" text,
            "price" integer,
            "riceKinds" text[] DEFAULT '{}',
            "sauceKinds" text[] DEFAULT '{}',
            "spiciness" integer,
            "canChangeSpicy" boolean DEFAULT false,
            "sideMenus" text[] DEFAULT '{}',
            "noodleKinds" text[] DEFAULT '{}',
            "sundaeType" text,
            "others" text[] DEFAULT '{}',
            "recommend" json DEFAULT '[]'::json,
            "averageRating" real DEFAULT 0,
            "reviewCount" integer DEFAULT 0
          );
        `);
        console.log("restaurants 테이블 생성 완료");
      }
    } catch (tableError) {
      console.error("테이블 확인/생성 실패:", tableError);
      // 테이블 생성 실패해도 계속 진행
    }

    // Drizzle을 사용한 쿼리 (필요한 필드들 추가)
    console.log("Neon Serverless로 restaurant 조회 시작");
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

    // 환경변수 관련 오류인지 확인
    if (error instanceof Error && error.message.includes("POSTGRES_URL")) {
      return NextResponse.json(
        {
          message: "데이터베이스 연결 설정이 필요합니다.",
          details: "Vercel Postgres 환경변수를 확인해주세요.",
        },
        { status: 500 },
      );
    }

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
