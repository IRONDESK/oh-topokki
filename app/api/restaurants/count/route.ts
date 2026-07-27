import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

// 홈 화면 "총 {n}개의 떡볶이 맛집" 배지용 — DB 전체 식당 개수
export async function GET() {
  try {
    const count = await prisma.restaurant.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("맛집 개수 조회 오류:", error);
    return NextResponse.json(
      { message: "맛집 개수 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
