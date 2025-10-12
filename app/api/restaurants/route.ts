import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    // parameter pagination
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const page = Math.max(parseInt(pageParam || "1", 10), 1);

    const PAGE_SIZE = 10 as const;
    const offset = (page - 1) * PAGE_SIZE;

    // Prisma를 사용한 쿼리
    const restaurantList = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        price: true,
        topokkiType: true,
        riceKinds: true,
        spiciness: true,
        reviewCount: true,
        averageRating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: PAGE_SIZE,
      skip: offset,
    });

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

    // DB에서 사용자 정보 조회하거나 생성 (Prisma 사용)
    let user = await prisma.user.findUnique({
      where: { email: authUser.email! }
    });

    if (!user) {
      // 사용자가 없으면 자동 생성
      user = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name ||
                authUser.user_metadata?.full_name ||
                null,
          avatar: authUser.user_metadata?.avatar_url || null,
          provider: authUser.app_metadata?.provider || "unknown",
          providerId: authUser.id,
        }
      });
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
