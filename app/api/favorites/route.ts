import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    // 쿠키에서 인증 세션의 유저 추출 (Better Auth가 users 테이블 row를 보장)
    const user = await getAuthenticatedUser();

    // 즐겨찾기 목록 조회
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            topokkiType: true,
            riceTypes: true,
            address: true,
            latitude: true,
            longitude: true,
            price: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { restaurant: { name: "asc" } }],
    });

    const formattedFavorites = favorites.map((favorite) => ({
      id: favorite.restaurant.id,
      name: favorite.restaurant.name,
      topokkiType: favorite.restaurant.topokkiType,
      riceTypes: favorite.restaurant.riceTypes,
      address: favorite.restaurant.address,
      latitude: favorite.restaurant.latitude,
      longitude: favorite.restaurant.longitude,
      price: favorite.restaurant.price,
      addedAt: favorite.createdAt,
      memo: favorite.memo,
    }));

    return NextResponse.json(formattedFavorites);
  } catch (error) {
    console.error("즐겨찾기 조회 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "즐겨찾기 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 쿠키에서 인증 세션의 유저 추출 (Better Auth가 users 테이블 row를 보장)
    const user = await getAuthenticatedUser();

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "식당 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { memo } = body;

    // 식당 존재 여부 확인
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "존재하지 않는 식당입니다." },
        { status: 404 },
      );
    }

    // 이미 즐겨찾기에 추가되었는지 확인
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurantId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_restaurantId: {
            userId: user.id,
            restaurantId: restaurantId,
          },
        },
      });
      return NextResponse.json(
        { message: "즐겨찾기에서 해제했습니다." },
        { status: 201 },
      );
    }

    // 즐겨찾기 추가
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        restaurantId: restaurantId,
        memo: memo || null,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            topokkiType: true,
            riceTypes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "즐겨찾기에 추가했습니다.",
        favorite: {
          id: favorite.restaurant.id,
          name: favorite.restaurant.name,
          topokkiType: favorite.restaurant.topokkiType,
          riceTypes: favorite.restaurant.riceTypes,
          addedAt: favorite.createdAt,
          memo: favorite.memo,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("즐겨찾기 추가 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "즐겨찾기 추가에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 쿠키에서 인증 세션의 유저 추출 (Better Auth가 users 테이블 row를 보장)
    const user = await getAuthenticatedUser();

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "식당 ID가 필요합니다." },
        { status: 400 },
      );
    }

    // 즐겨찾기 존재 여부 확인 및 삭제
    const deletedFavorite = await prisma.favorite.delete({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurantId,
        },
      },
    });

    return NextResponse.json({
      message: "즐겨찾기에서 제거되었습니다.",
    });
  } catch (error) {
    console.error("즐겨찾기 삭제 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Prisma의 RecordNotFound 에러 처리
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { error: "즐겨찾기에 추가되지 않은 식당입니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "즐겨찾기 삭제에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
