import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        restaurantId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('리뷰 조회 오류:', error);
    return NextResponse.json(
      { error: '리뷰 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 쿠키에서 사용자 인증 정보 추출
    const authUser = await getAuthenticatedUser();

    // DB에서 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! }
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, rating } = body;

    if (!content || !rating) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '별점은 1-5 사이의 값이어야 합니다.' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating: parseInt(rating),
        authorId: user.id,
        restaurantId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // 맛집의 평균 별점과 리뷰 개수 업데이트
    const reviews = await prisma.review.findMany({
      where: { restaurantId: params.id },
      select: { rating: true },
    });

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const reviewCount = reviews.length;

    await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        averageRating,
        reviewCount,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('리뷰 생성 오류:', error);

    if (error instanceof Error && (error.message.includes("로그인") || error.message.includes("인증"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: '리뷰 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}