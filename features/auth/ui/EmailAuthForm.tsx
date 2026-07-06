"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Button from "@/shared/ui/Button";
import Icons from "@/shared/ui/Icons";

type Mode = "signin" | "signup";

interface EmailAuthFormProps {
  onSuccess?: () => void;
}

const NICKNAME_TTEOK = [
  "밀떡",
  "쌀떡",
  "즉석떡",
  "로제떡",
  "짜장떡",
  "궁중떡",
  "간장떡",
  "치즈떡",
  "매운떡",
  "마라떡",
];
const NICKNAME_VERBS = ["먹는", "만든", "찾는", "망친", "엎은", "끓이는"];
const NICKNAME_WHO = [
  "오리",
  "돼지",
  "하마",
  "여우",
  "냥이",
  "멍이",
  "소라",
  "너구리",
  "고등어",
  "문어",
  "호랑이",
  "토끼",
  "곰",
  "원숭이",
  "사자",
  "사장",
  "회장",
  "부장",
  "직원",
  "알바",
  "요리사",
  "개발자",
];

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const generateNickname = () =>
  `${pick(NICKNAME_TTEOK)}볶이${pick(NICKNAME_VERBS)}${pick(NICKNAME_WHO)}${Math.floor(Math.random() * 99) + 1}`;

export default function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [nickname, setNickname] = useState(generateNickname);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup" && password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않아요");
      return;
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
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full cursor-pointer flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <Icons name="refresh" w="bold" size={16} t="round" />
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

      <Button type="submit" disabled={loading} className="w-full mt-1">
        {loading && (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {mode === "signup" ? "회원가입" : "로그인"}
      </Button>

      <button
        type="button"
        onClick={toggleMode}
        className="text-sm font-medium text-gray-500 mt-1"
      >
        {mode === "signin"
          ? "계정이 없으신가요? 회원가입"
          : "이미 계정이 있으신가요? 로그인"}
      </button>
    </form>
  );
}
