"use client";

import React, { useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { Provider } from "@supabase/supabase-js";

interface LoginButtonProps {
  provider: Provider;
  children: React.ReactNode;
}

export default function LoginButton({ provider, children }: LoginButtonProps) {
  const { signInWithOAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      alert(`${provider} 로그인 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      data-provider={provider}
      className="cursor-pointer w-full flex items-center justify-center gap-1.5 py-4 text-center rounded-xl text-lg font-medium data-[provider=kakao]:bg-[#FEE500] data-[provider=naver]:bg-[rgba(3,199,90,1)] data-[provider=naver]:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {children}
    </button>
  );
}
