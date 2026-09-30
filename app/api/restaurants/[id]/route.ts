import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { restaurantPath } from "@/shared/constants/site";
import { prisma } from "@/shared/lib/prisma";
import { getAuthenticatedUser } from "@/shared/lib/auth-server";
import { findRestaurantDetail } from "@/features/restaurant/api/restaurant-detail.server";

// 조회수 중복 방지: 최근에 본 식당 id·시각을 쿠키에 담아 24시간 내 재조회는 카운트하지 않는다.
const VIEW_COOKIE = "viewed_restaurants";
const VIEW_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;
const VIEW_COOKIE_MAX_ENTRIES = 60; // 쿠키 4KB 제한 대비 상한

type ViewEntry = { rid: string; ts: number };

// 쿠키 값 형식: "<id>.<timestamp>_<id>.<timestamp>..." (uuid에는 '.'과 '_'가 없음)
function parseViewCookie(raw: string | undefined, now: number): ViewEntry[] {
  if (!raw) return [];
  return raw
    .split("_")
    .map((entry) => {
      const [rid, ts] = entry.split(".");
      return { rid, ts: Number(ts) };
    })
    .filter(
      (e) => e.rid && !isNaN(e.ts) && now - e.ts < VIEW_DEDUP_WINDOW_MS,
    );
}

function serializeViewCookie(entries: ViewEntry[]): string {
  return entries
    .slice(-VIEW_COOKIE_MAX_ENTRIES)
    .map((e) => `${e.rid}.${e.ts}`)
    .join("_");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const restaurant = await findRestaurantDetail(id);

    if (!restaurant) {
      return NextResponse.json(
        { message: "맛집을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 조회수 증가 (동시 요청에도 안전한 원자적 increment)
    // 단, 24시간 내 같은 브라우저의 재조회는 쿠키로 걸러 중복 카운트하지 않는다.
    const now = Date.now();
    const viewEntries = parseViewCookie(
      request.cookies.get(VIEW_COOKIE)?.value,
      now,
    );
    const alreadyViewed = viewEntries.some((e) => e.rid === id);

    let viewCount = restaurant.viewCount;
    if (!alreadyViewed) {
      ({ viewCount } = await prisma.restaurant.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: { viewCount: true },
      }));
      viewEntries.push({ rid: id, ts: now });
    }

    // 로그인 사용자의 즐겨찾기 여부 (비로그인이면 null)
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
    } catch {
      isFavorite = null;
    }

    const result = { ...restaurant, viewCount, isFavorite };

    const response = NextResponse.json(result);
    response.cookies.set(VIEW_COOKIE, serializeViewCookie(viewEntries), {
      maxAge: VIEW_DEDUP_WINDOW_MS / 1000,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("맛집 조회 오류:", error);
    return NextResponse.json(
      { message: "맛집 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

// 본인이 등록한 식당인지 검증. 실패 시 에러 응답 반환.
async function assertOwnRestaurant(id: string) {
  const user = await getAuthenticatedUser();

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!restaurant) {
    return NextResponse.json(
      { message: "맛집을 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  if (!restaurant.authorId || restaurant.authorId !== user.id) {
    return NextResponse.json(
      { message: "본인이 등록한 맛집만 수정/삭제할 수 있습니다." },
      { status: 403 },
    );
  }
  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authError = await assertOwnRestaurant(id);
    if (authError) return authError;

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
    if (priceServings)
      updateData.priceServings = Math.max(parseInt(priceServings, 10) || 1, 1);
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

    revalidatePath(restaurantPath(id)); // 서버 렌더링된 상세 페이지 캐시 갱신
    return NextResponse.json(result);
  } catch (error) {
    console.error("맛집 수정 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

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

    const authError = await assertOwnRestaurant(id);
    if (authError) return authError;

    await prisma.restaurant.delete({ where: { id } });

    revalidatePath(restaurantPath(id));
    return NextResponse.json({ message: "맛집이 삭제되었습니다." });
  } catch (error) {
    console.error("맛집 삭제 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "맛집 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
