import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";

/** 로그인한 유저가 작성한 리뷰 목록 (내 정보 시트의 '내 리뷰' 탭) */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const reviews = await prisma.review.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
        restaurant: {
          select: { id: true, name: true, address: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("내 리뷰 조회 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "내 리뷰 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
