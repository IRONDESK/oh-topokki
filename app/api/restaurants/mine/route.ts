import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";

/** 로그인한 유저가 등록한 맛집 목록 (내 정보 시트의 '내 작성글 목록') */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const restaurants = await prisma.restaurant.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        price: true,
        priceServings: true,
        topokkiType: true,
        reviewCount: true,
        averageRating: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("내 작성글 조회 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "내 작성글 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
