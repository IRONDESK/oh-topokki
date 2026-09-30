import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";
import { generateNickname } from "@/shared/lib/nickname";
import { syncRestaurantStats } from "@/shared/lib/restaurant-stats";

// 익명 리뷰 표시용 IP 앞부분 ("XXX.XXX"). 프록시 뒤에서는 x-forwarded-for의 첫 값 사용.
function getIpPrefix(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  if (ip.includes(".")) {
    return ip.split(".").slice(0, 2).join(".");
  }
  if (ip.includes(":")) {
    // IPv6는 앞 2개 그룹까지
    return ip.split(":").filter(Boolean).slice(0, 2).join(":");
  }
  return "0.0";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const reviewList = await prisma.review.findMany({
      where: {
        restaurantId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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

    // 로그인 여부 확인 — 비로그인도 익명 리뷰(별점 없이 의견만)를 허용한다.
    let user: { id: string } | null = null;
    try {
      user = await getAuthenticatedUser();
    } catch {
      user = null;
    }

    const body = await request.json();
    const { content, rating } = body;

    if (!content) {
      return NextResponse.json(
        { message: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    // 별점은 로그인 사용자만 부여 가능
    if (!user && rating != null) {
      return NextResponse.json(
        { message: "별점은 로그인 후 남길 수 있습니다." },
        { status: 401 },
      );
    }

    if (rating != null && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: "별점은 1-5 사이의 값이어야 합니다." },
        { status: 400 },
      );
    }

    // 리뷰 생성 (비로그인은 "익명의○○" 랜덤 닉네임 + IP 앞 2옥텟 저장)
    const newReview = await prisma.review.create({
      data: {
        content,
        rating: rating != null ? parseInt(rating) : null,
        authorId: user?.id ?? null,
        guestNickname: user ? null : `익명의${generateNickname()}`,
        guestIpPrefix: user ? null : getIpPrefix(request),
        restaurantId: id,
      },
    });

    // 작성자 정보 조회 (익명 리뷰는 author 없음)
    const author = user
      ? await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        })
      : null;

    // 맛집의 평균 별점과 리뷰 개수 업데이트 (평균은 별점 있는 리뷰만 대상)
    await syncRestaurantStats(id);

    // 응답 구성
    const result = {
      ...newReview,
      author: author || null,
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
