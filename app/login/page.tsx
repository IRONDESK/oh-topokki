"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";
import Spinner from "@/shared/ui/Spinner";
import { fonts } from "@/shared/style/typo.css";
import { flexs } from "@/shared/style/container.css";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <section className={flexs({ dir: "col", gap: "16" })} style={{ height: "100%", width: "100%" }}>
      <Spinner color="primary" size={36} thick={3} />
      <p className={fonts.head4.medium}>처리 중...</p>
    </section>
  );
}
