import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 레스토랑 기본 정보 조회
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 작성자 정보 조회 (탈퇴한 작성자는 authorId가 null)
    const author = restaurant.authorId
      ? await prisma.user.findUnique({
          where: { id: restaurant.authorId },
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        })
      : null;

    // 리뷰 정보 조회
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId: id },
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

    // 즐겨찾기 총 개수 조회
    const favoriteCnt = await prisma.favorite.count({
      where: { restaurantId: id },
    });

    // 로그인 사용자의 즐겨찾기 여부 확인
    let isFavorite: boolean | null = null;
    try {
      const user = await getAuthenticatedUser();
      const userFavorite = await prisma.favorite.findUnique({
        where: {
          userId_restaurantId: {
            userId: user.id,
            restaurantId: id,
          },
        },
      });
      isFavorite = !!userFavorite;
    } catch (authError) {
      // 인증 오류 시 isFavorite은 null로 유지
      isFavorite = null;
    }

    // 결과 조합
    const result = {
      ...restaurant,
      author: author || null,
      reviews: restaurantReviews,
      isFavorite,
      favoriteCnt,
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
      riceTypes = [],
      sauceTypes = [],
      spiciness,
      canChangeSpicy,
      sideMenus = [],
      noodleTypes = [],
      sundaeType,
      others = [],
      recommend = [],
    } = body;

    // 맛집 정보 업데이트
    const updateData: any = {
      name,
      address,
      phoneNumber,
      // 빈 문자열은 유효한 enum 값이 아니므로 null로 정규화
      topokkiType: topokkiType || null,
      sundaeType: sundaeType || null,
      riceTypes,
      sauceTypes,
      canChangeSpicy,
      sideMenus,
      noodleTypes,
      others,
      recommend,
    };

    if (latitude) updateData.latitude = parseFloat(latitude);
    if (longitude) updateData.longitude = parseFloat(longitude);
    if (price) updateData.price = parseInt(price);
    if (spiciness !== undefined) updateData.spiciness = parseInt(spiciness);

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData,
    });

    if (!updatedRestaurant) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 작성자 정보 조회 (탈퇴한 작성자는 authorId가 null)
    const author = updatedRestaurant.authorId
      ? await prisma.user.findUnique({
          where: { id: updatedRestaurant.authorId },
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        })
      : null;

    const result = {
      ...updatedRestaurant,
      author: author || null,
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

    const deletedRestaurant = await prisma.restaurant.delete({
      where: { id },
    });

    if (!deletedRestaurant) {
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
