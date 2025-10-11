import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export const runtime = 'edge';

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
    // 쿠키에서 사용자 인증 정보 추출
    const authUser = await getAuthenticatedUser();

    // DB에서 사용자 정보 조회하거나 생성
    let user = await prisma.user.findUnique({
      where: { email: authUser.email! }
    });

    if (!user) {
      // 사용자가 없으면 자동 생성 (기존 로그인 사용자 대응)
      user = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || null,
          avatar: authUser.user_metadata?.avatar_url || null,
          provider: authUser.app_metadata?.provider || 'unknown',
          providerId: authUser.id,
        }
      });
    }

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
      canChangeSpicy = false,
      sideMenus = [],
      noodleKinds = [],
      sundaeType,
      others = [],
      recommend = [],
      myComment,
    } = body;

    // 필수 필드 검증
    if (!name || !address || !latitude || !longitude) {
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
        authorId: user.id,
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
          authorId: user.id,
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
    console.error("Error details:", error instanceof Error ? error.message : String(error));

    if (error instanceof Error && (error.message.includes("로그인") || error.message.includes("인증"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "맛집 등록에 실패했습니다.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
