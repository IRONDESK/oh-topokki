"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

type Session = typeof authClient.$Infer.Session;
// Better Auth 내부 필드는 `name`이지만 앱 전역에서는 `nickname`으로 노출한다.
type SessionUser = Session["user"] & { nickname: string };

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
  };

  const rawUser = data?.user ?? null;

  const value: AuthContextType = {
    user: rawUser ? { ...rawUser, nickname: rawUser.name } : null,
    loading: isPending,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
