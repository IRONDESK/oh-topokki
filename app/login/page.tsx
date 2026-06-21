"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";
import Spinner from "@/shared/ui/Spinner";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <section className="flex flex-col gap-4 items-center justify-center h-full w-full">
      <Spinner color="primary" size={36} thick={3} />
      <p className="text-4xl font-medium">처리 중...</p>
    </section>
  );
}
