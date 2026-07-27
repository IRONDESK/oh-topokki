"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Button from "@/shared/ui/Button";
import Spinner from "@/shared/ui/Spinner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // 링크가 만료됐거나 토큰이 없는 경우
  if (error || !token) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 h-full w-full px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          링크가 만료됐어요
        </h2>
        <p className="text-gray-500">
          비밀번호 재설정 링크가 유효하지 않아요.
          <br />
          로그인 화면에서 다시 요청해주세요.
        </p>
        <Button
          type="button"
          className="mt-2"
          onClick={() => router.replace("/")}
        >
          홈으로 돌아가기
        </Button>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않아요");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) throw new Error(error.message ?? "재설정에 실패했어요");
      toast.success("비밀번호가 변경됐어요. 새 비밀번호로 로그인해주세요");
      router.replace("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-full w-full px-6">
      <div className="w-full max-w-sm flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          새 비밀번호 설정
        </h2>
        <p className="text-gray-500">사용할 새 비밀번호를 입력해주세요</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 pt-6 w-full max-w-sm"
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full py-4 px-4 rounded-xl text-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary-300"
        />
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="새 비밀번호 확인"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full py-4 px-4 rounded-xl text-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary-300"
        />
        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading && (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          )}
          비밀번호 변경
        </Button>
      </form>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="flex items-center justify-center h-full w-full">
          <Spinner color="primary" size={36} thick={3} />
        </section>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}