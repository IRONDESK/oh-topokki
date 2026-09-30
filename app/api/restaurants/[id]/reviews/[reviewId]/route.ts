import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";
import { syncRestaurantStats } from "@/shared/lib/restaurant-stats";

type RouteParams = { params: Promise<{ id: string; reviewId: string }> };

// 본인 리뷰인지 검증하고 리뷰를 반환. 실패 시 에러 응답을 반환한다.
async function findOwnReview(id: string, reviewId: string) {
  const user = await getAuthenticatedUser();

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.restaurantId !== id) {
    return {
      error: NextResponse.json(
        { message: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      ),
    };
  }

  // 익명 리뷰(authorId null)는 소유자를 특정할 수 없으므로 수정/삭제 불가
  if (!review.authorId || review.authorId !== user.id) {
    return {
      error: NextResponse.json(
        { message: "본인이 작성한 리뷰만 수정/삭제할 수 있습니다." },
        { status: 403 },
      ),
    };
  }

  return { review };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, reviewId } = await params;
    const { error } = await findOwnReview(id, reviewId);
    if (error) return error;

    const body = await request.json();
    const { content, rating } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    if (rating != null && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: "별점은 1-5 사이의 값이어야 합니다." },
        { status: 400 },
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        content: content.trim(),
        ...(rating != null ? { rating: parseInt(rating) } : {}),
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
    });

    await syncRestaurantStats(id);

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("리뷰 수정 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "리뷰 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, reviewId } = await params;
    const { error } = await findOwnReview(id, reviewId);
    if (error) return error;

    await prisma.review.delete({ where: { id: reviewId } });
    await syncRestaurantStats(id);

    return NextResponse.json({ message: "리뷰가 삭제되었습니다." });
  } catch (error) {
    console.error("리뷰 삭제 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "리뷰 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
