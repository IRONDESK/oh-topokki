"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { loginStyle } from "@/components/login/login.css";

interface LoginButtonProps {
  provider: "kakao" | "naver";
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
      className={loginStyle.button}
      data-provider={provider}
    >
      {loading ? (
        <div
          style={{
            animation: "spin 1s linear infinite",
            borderRadius: "50%",
            height: "16px",
            width: "16px",
            border: "2px solid currentColor",
            borderTop: "2px solid transparent",
            marginRight: "8px",
          }}
        ></div>
      ) : null}
      {children}
    </button>
  );
}
