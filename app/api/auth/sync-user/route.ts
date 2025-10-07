import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();

    // 이미 존재하는 사용자인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: authUser.email! }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || null,
        avatar: authUser.user_metadata?.avatar_url || null,
        provider: authUser.app_metadata?.provider || 'unknown',
        providerId: authUser.id,
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("사용자 동기화 오류:", error);

    if (error instanceof Error && (error.message.includes("로그인") || error.message.includes("인증"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "사용자 동기화에 실패했습니다." },
      { status: 500 }
    );
  }
}