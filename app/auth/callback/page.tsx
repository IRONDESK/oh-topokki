"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { overlayStyle } from "@/share/components/css/modal.css";
import Spinner from "@/share/components/Spinner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/login?error=auth_error");
          return;
        }

        if (data.session) {
          // 사용자를 DB에 생성
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          router.push("/");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=callback_error");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className={overlayStyle.dim}>
      <Spinner size={32} thick={2} />
    </div>
  );
}
