import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "5000"); // 기본 5km

    let restaurants;

    if (lat && lng) {
      // 위치 기반 검색 (Haversine formula 사용)
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      restaurants = await prisma.$queryRaw`
        SELECT *, 
          (6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )) AS distance
        FROM restaurants
        HAVING distance < ${radius / 1000}
        ORDER BY distance;
      `;
    } else {
      // 전체 맛집 목록
      restaurants = await prisma.restaurant.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reviews: {
            take: 3,
            orderBy: {
              createdAt: "desc",
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
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("맛집 조회 오류:", error);
    return NextResponse.json(
      { error: "맛집 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      latitude,
      longitude,
      phoneNumber,
      authorId,
      topokkiType,
      price,
      riceKinds = [],
      sauceKinds = [],
      spiciness,
      canChangeSpicy = false,
      sideMenus = [],
      noodleKinds = [],
      sundaeType,
      others = [],
      recommend = [],
      myComment,
    } = body;

    // 필수 필드 검증
    if (!name || !address || !latitude || !longitude || !authorId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        phoneNumber,
        authorId,
        topokkiType,
        price: price ? parseInt(price) : null,
        sundaeType,
        riceKinds: riceKinds,
        sauceKinds: sauceKinds,
        spiciness: spiciness ? parseInt(spiciness) : null,
        canChangeSpicy,
        sideMenus: sideMenus,
        noodleKinds: noodleKinds,
        others: others,
        recommend: recommend,
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

    // 나의 한마디가 있으면 첫 번째 리뷰로 등록
    if (myComment && myComment.trim()) {
      await prisma.review.create({
        data: {
          content: myComment.trim(),
          rating: 5, // 기본 5점으로 설정 (작성자가 추천하는 맛집이므로)
          authorId,
          restaurantId: restaurant.id,
        },
      });

      // 평점 업데이트
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          averageRating: 5,
          reviewCount: 1,
        },
      });
    }

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("맛집 생성 오류:", error);
    return NextResponse.json(
      { error: "맛집 등록에 실패했습니다." },
      { status: 500 },
    );
  }
}
