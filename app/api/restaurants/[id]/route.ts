import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // 작성자 정보 조회
    const author = await prisma.user.findUnique({
      where: { id: restaurant.authorId },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    // 리뷰 정보 조회
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId: id },
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
        createdAt: "desc",
      },
    });

    // 결과 조합
    const result = {
      ...restaurant,
      author: author || null,
      reviews: restaurantReviews,
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
      riceKinds = [],
      sauceKinds = [],
      spiciness,
      canChangeSpicy,
      sideMenus = [],
      noodleKinds = [],
      sundaeType,
      others = [],
      recommend = [],
    } = body;

    // 맛집 정보 업데이트
    const updateData: any = {
      name,
      address,
      phoneNumber,
      topokkiType,
      sundaeType,
      riceKinds,
      sauceKinds,
      canChangeSpicy,
      sideMenus,
      noodleKinds,
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

    // 작성자 정보 조회
    const author = await prisma.user.findUnique({
      where: { id: updatedRestaurant.authorId },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

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
