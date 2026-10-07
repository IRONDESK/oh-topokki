import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const pageParam = searchParams.get("page");
    const page = Math.max(parseInt(pageParam || "1", 10), 1);

    const PAGE_SIZE = 15 as const;
    const offset = (page - 1) * PAGE_SIZE;
    const searchTerm = (query ?? "").trim();

    // 검색 화면 필터 — 파라미터 이름은 Prisma 필드명과 일치시킨다 (app/api/restaurants와 동일 규칙)
    const topokkiTypeParam = searchParams.get("topokkiType");
    const riceTypesParam = searchParams.get("riceTypes");
    const sauceTypesParam = searchParams.get("sauceTypes");
    const sundaeTypeParam = searchParams.get("sundaeType");
    const sideMenuParam = searchParams.getAll("sideMenus");
    const minSpicinessParam = searchParams.get("minSpiciness");
    const maxSpicinessParam = searchParams.get("maxSpiciness");

    const filters: any = {};
    if (topokkiTypeParam) filters.topokkiType = topokkiTypeParam;
    if (riceTypesParam) filters.riceTypes = { has: riceTypesParam };
    if (sauceTypesParam) filters.sauceTypes = { has: sauceTypesParam };
    if (sundaeTypeParam) {
      // "exists"는 순대를 파는 집(not null) 센티널 — app/api/restaurants와 동일
      filters.sundaeType =
        sundaeTypeParam === "exists" ? { not: null } : sundaeTypeParam;
    }
    if (sideMenuParam.length > 0) {
      filters.sideMenus = { hasEvery: sideMenuParam };
    }
    const minSpiciness = parseInt(minSpicinessParam ?? "", 10);
    const maxSpiciness = parseInt(maxSpicinessParam ?? "", 10);
    if (!isNaN(minSpiciness) || !isNaN(maxSpiciness)) {
      filters.spiciness = {
        ...(!isNaN(minSpiciness) && { gte: minSpiciness }),
        ...(!isNaN(maxSpiciness) && { lte: maxSpiciness }),
      };
    }

    // 키워드 없이 필터만으로도 검색 가능. 둘 다 없으면 에러.
    if (searchTerm === "" && Object.keys(filters).length === 0) {
      return NextResponse.json(
        { error: "검색어나 필터를 입력해주세요." },
        { status: 400 }
      );
    }

    // 식당명, 사이드메뉴, 기타 필드에서 키워드 검색
    const where = {
      ...filters,
      ...(searchTerm !== "" && {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive' as const
            }
          },
          {
            sideMenus: {
              hasSome: [searchTerm]
            }
          },
          {
            others: {
              hasSome: [searchTerm]
            }
          }
        ]
      })
    };

    const restaurants = await prisma.restaurant.findMany({
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
        sideMenus: true,
        others: true,
        recommend: true, // 지도앱 버튼의 네이버 플레이스 링크
        createdAt: true,
      },
      orderBy: [
        {
          averageRating: "desc"
        },
        {
          reviewCount: "desc"
        },
        {
          createdAt: "desc"
        }
      ],
      take: PAGE_SIZE,
      skip: offset,
    });

    // 전체 검색 결과 수 계산
    const totalCount = await prisma.restaurant.count({ where });

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return NextResponse.json({
      items: restaurants,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("식당 검색 오류:", error);

    return NextResponse.json(
      {
        error: "식당 검색에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}