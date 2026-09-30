import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    // parameter pagination
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    // 필터 파라미터 이름은 실제 Prisma 필드명과 일치시킨다(혼동 방지)
    const topokkiTypeParam = searchParams.get("topokkiType");
    const riceTypesParam = searchParams.get("riceTypes");
    const sauceTypesParam = searchParams.get("sauceTypes");
    const sundaeTypeParam = searchParams.get("sundaeType");
    const noodleTypesParam = searchParams.get("noodleTypes");
    const maxPriceParam = searchParams.get("maxPrice");
    const sideMenuParam = searchParams.getAll("sideMenus");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius");

    const page = Math.max(parseInt(pageParam || "1", 10), 1);

    const PAGE_SIZE = 10 as const;
    const offset = (page - 1) * PAGE_SIZE;

    // 위치 기반 조회 (지도용): lat/lng가 오면 반경 내 식당을 pagination 없이 전부 반환
    const lat = latParam ? parseFloat(latParam) : NaN;
    const lng = lngParam ? parseFloat(lngParam) : NaN;
    const radius = radiusParam ? parseFloat(radiusParam) : 10000; // 기본 10km
    const isLocationQuery = !isNaN(lat) && !isNaN(lng) && !isNaN(radius);

    // 필터링 조건 구성
    const where: any = {};

    if (topokkiTypeParam) {
      where.topokkiType = topokkiTypeParam;
    }

    if (riceTypesParam) {
      where.riceTypes = {
        has: riceTypesParam,
      };
    }

    if (sauceTypesParam) {
      where.sauceTypes = {
        has: sauceTypesParam,
      };
    }

    if (sundaeTypeParam) {
      // sundaeType은 단일값(enum). "exists"는 "순대를 파는 집"(not null)을 의미하는
      // 빠른필터용 센티널이고, 그 외에는 특정 enum 값과 동등 비교.
      where.sundaeType =
        sundaeTypeParam === "exists" ? { not: null } : sundaeTypeParam;
    }

    if (noodleTypesParam) {
      where.noodleTypes = {
        has: noodleTypesParam,
      };
    }

    if (maxPriceParam) {
      const maxPrice = parseInt(maxPriceParam, 10);
      if (!isNaN(maxPrice)) {
        // 세트(n인분) 가격은 1인분 기준으로 환산해 비교:
        // price / priceServings <= maxPrice  ⇔  price <= maxPrice * priceServings.
        // Prisma where로는 컬럼 간 연산이 안 되므로 인분 수별 OR로 풀어쓴다.
        where.AND = [
          {
            OR: Array.from({ length: 8 }, (_, i) => i + 1).map((n) => ({
              priceServings: n,
              price: { lte: maxPrice * n },
            })),
          },
        ];
      }
    }

    // 매운맛 구간 필터 (검색 화면과 동일 파라미터)
    const minSpiciness = parseInt(searchParams.get("minSpiciness") ?? "", 10);
    const maxSpiciness = parseInt(searchParams.get("maxSpiciness") ?? "", 10);
    if (!isNaN(minSpiciness) || !isNaN(maxSpiciness)) {
      where.spiciness = {
        ...(!isNaN(minSpiciness) && { gte: minSpiciness }),
        ...(!isNaN(maxSpiciness) && { lte: maxSpiciness }),
      };
    }

    if (sideMenuParam.length > 0) {
      where.sideMenus = {
        hasEvery: sideMenuParam,
      };
    }

    if (isLocationQuery) {
      // 반경(m)을 위도/경도 델타로 환산한 bounding box 필터.
      // PostGIS 없이 lat/lng 컬럼 범위 비교로 처리 (수천 건 규모까지는 충분).
      const latDelta = radius / 111320;
      const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));
      where.latitude = { gte: lat - latDelta, lte: lat + latDelta };
      where.longitude = { gte: lng - lngDelta, lte: lng + lngDelta };
    }

    // Prisma를 사용한 쿼리
    const restaurantList = await prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        price: true,
        priceServings: true,
        topokkiType: true,
        riceTypes: true,
        spiciness: true,
        reviewCount: true,
        averageRating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      // 위치 기반 조회는 지도 마커용이므로 pagination 없이 반경 내 전체 반환
      ...(isLocationQuery ? {} : { take: PAGE_SIZE, skip: offset }),
    });

    console.log("조회된 맛집 수:", restaurantList.length);
    return NextResponse.json(restaurantList);
  } catch (error) {
    console.error("맛집 조회 오류:", error);
    console.error(
      "오류 상세:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "오류 스택:",
      error instanceof Error ? error.stack : "No stack",
    );

    // 환경변수 관련 오류인지 확인
    if (error instanceof Error && error.message.includes("POSTGRES_URL")) {
      return NextResponse.json(
        {
          message: "데이터베이스 연결 설정이 필요합니다.",
          details: "Vercel Postgres 환경변수를 확인해주세요.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "맛집 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 인증 세션의 유저 추출 (Better Auth가 users 테이블 row를 보장)
    const user = await getAuthenticatedUser();

    const body = await request.json();
    const {
      name,
      address,
      latitude,
      longitude,
      phoneNumber,
      topokkiType,
      price,
      priceServings,
      riceTypes = [],
      sauceTypes = [],
      spiciness,
      canChangeSpicy = false,
      sideMenus = [],
      noodleTypes = [],
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
        // 빈 문자열은 유효한 enum 값이 아니므로 null로 정규화
        topokkiType: topokkiType || null,
        price: price ? parseInt(price) : null,
        priceServings: Math.max(parseInt(priceServings, 10) || 1, 1),
        sundaeType: sundaeType || null,
        riceTypes,
        sauceTypes,
        spiciness: spiciness ? parseInt(spiciness) : null,
        canChangeSpicy,
        sideMenus,
        noodleTypes,
        others,
        recommend,
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
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "맛집 등록에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
