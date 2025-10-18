import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const pageParam = searchParams.get("page");
    const page = Math.max(parseInt(pageParam || "1", 10), 1);

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "검색어를 입력해주세요." },
        { status: 400 }
      );
    }

    const PAGE_SIZE = 10 as const;
    const offset = (page - 1) * PAGE_SIZE;
    const searchTerm = query.trim();

    // 식당명, 사이드메뉴, 기타 필드에서 키워드 검색
    const restaurants = await prisma.restaurant.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
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
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        price: true,
        topokkiType: true,
        riceKinds: true,
        spiciness: true,
        reviewCount: true,
        averageRating: true,
        sideMenus: true,
        others: true,
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
    const totalCount = await prisma.restaurant.count({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
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
      }
    });

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