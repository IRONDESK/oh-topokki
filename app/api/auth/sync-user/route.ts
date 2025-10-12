import { NextResponse } from "next/server";
import { db, users } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function POST() {
  try {
    const authUser = await getAuthenticatedUser();

    // 이미 존재하는 사용자인지 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0] });
    }

    // 새 사용자 생성
    const newUser = await db
      .insert(users)
      .values({
        id: authUser.id,
        email: authUser.email!,
        name:
          authUser.user_metadata?.name ||
          authUser.user_metadata?.full_name ||
          null,
        avatar: authUser.user_metadata?.avatar_url || null,
        provider: authUser.app_metadata?.provider || "unknown",
        providerId: authUser.id,
      })
      .returning();

    return NextResponse.json({ user: newUser[0] });
  } catch (error) {
    console.error("사용자 동기화 오류:", error);

    if (
      error instanceof Error &&
      (error.message.includes("로그인") || error.message.includes("인증"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "사용자 동기화에 실패했습니다." },
      { status: 500 },
    );
  }
}
