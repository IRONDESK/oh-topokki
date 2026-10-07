"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { overlay } from "overlay-kit";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { generateNickname } from "@/shared/lib/nickname";
import Button from "@/shared/ui/Button";
import Icons from "@/shared/ui/Icons";
import type { LegalTab } from "@/features/legal/ui/LegalTabs";

// 약관 본문은 링크를 눌렀을 때만 로드
const LegalSheet = dynamic(() => import("@/features/legal/ui/LegalSheet"));

const openLegal = (tab: LegalTab) =>
  overlay.open((controller) => (
    <LegalSheet controller={controller} tab={tab} />
  ));

type Mode = "signin" | "signup" | "forgot";

interface EmailAuthFormProps {
  onSuccess?: () => void;
}

export default function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [nickname, setNickname] = useState(generateNickname);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "forgot") {
      setLoading(true);
      try {
        const { error } = await authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        });
        if (error) throw new Error(error.message ?? "요청에 실패했어요");
        toast.success("비밀번호 재설정 링크를 이메일로 보냈어요");
        setMode("signin");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "오류가 발생했어요",
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "signup") {
      if (password !== passwordConfirm) {
        toast.error("비밀번호가 일치하지 않아요");
        return;
      }
      // 만 14세 이상 확인 + 약관 동의를 체크박스 하나로 받는다.
      // (만 14세 미만은 보호법 제22조의2 법정대리인 동의 대상이라 가입 자체를 받지 않음)
      if (!ageConfirmed) {
        toast.error("만 14세 이상 확인과 약관 동의가 필요해요");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        // Better Auth API 필드는 `name` (DB에는 nickname으로 저장됨)
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: nickname,
        });
        if (error) throw new Error(error.message ?? "회원가입에 실패했어요");
        toast.success("가입이 완료됐어요");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? "로그인에 실패했어요");
        toast.success("로그인했어요");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setPasswordConfirm("");
    setAgeConfirmed(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-5 w-full">
      {mode === "signup" && (
        <div className="relative">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            required
            autoComplete="nickname"
            className="w-full py-4 pl-4 pr-14 rounded-btn text-lg bg-gray-100 border-[1.5px] border-transparent outline-none focus:border-primary-400 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setNickname(generateNickname())}
            aria-label="닉네임 다시 생성"
            className="absolute right-0 top-0 h-full pr-3 pl-2 group cursor-pointer flex items-center justify-center"
          >
            <span className="size-10 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600">
              <Icons name="refresh" w="bold" size={18} t="round" />
            </span>
          </button>
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
        autoComplete="email"
        className="w-full py-4 px-4 rounded-xl text-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary-300"
      />
      {mode !== "forgot" && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full py-4 px-4 rounded-xl text-lg bg-gray-100 outline-none focus:ring-2 focus:ring-primary-300"
        />
      )}
      {mode === "signup" && (
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full py-4 px-4 rounded-btn text-lg bg-gray-100 border-[1.5px] border-transparent outline-none focus:border-primary-400 focus:bg-white"
        />
      )}

      {mode === "signup" && (
        <label className="flex items-start gap-2 px-1 py-1 text-base leading-relaxed text-gray-600 break-keep cursor-pointer select-none">
          <input
            type="checkbox"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-primary-500 cursor-pointer"
          />
          <span>
            만 14세 이상이며,{" "}
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="cursor-pointer font-medium text-gray-700 underline underline-offset-2"
            >
              서비스 이용약관
            </button>
            과{" "}
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="cursor-pointer font-medium text-gray-700 underline underline-offset-2"
            >
              개인정보 처리방침
            </button>
            에 동의합니다
          </span>
        </label>
      )}

      <Button
        type="submit"
        // 회원가입은 만 14세 이상·약관 동의 체크 후에만 활성화
        disabled={loading || (mode === "signup" && !ageConfirmed)}
        className="w-full mt-1"
      >
        {loading && (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {mode === "signup"
          ? "회원가입"
          : mode === "forgot"
            ? "재설정 링크 받기"
            : "로그인"}
      </Button>

      {mode === "forgot" ? (
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="text-sm font-medium text-gray-500 mt-1"
        >
          로그인으로 돌아가기
        </button>
      ) : (
        <div className="flex items-center justify-center gap-4 mt-1">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-medium text-gray-500"
          >
            {mode === "signin"
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>
          {/*{mode === "signin" && (*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    onClick={() => setMode("forgot")}*/}
          {/*    className="text-sm font-medium text-gray-500"*/}
          {/*  >*/}
          {/*    비밀번호 찾기*/}
          {/*  </button>*/}
          {/*)}*/}
        </div>
      )}
    </form>
  );
}
