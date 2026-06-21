"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/shared/context/AuthContext";
import { OverlayProvider } from "overlay-kit";
import { Provider as JotaiProvider } from "jotai";
import { Toaster } from "sonner";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <AuthProvider>
          <Toaster
            duration={2000}
            position="top-center"
            className="text-base font-medium"
            toastOptions={{
              style: {
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "inherit",
                borderColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              },
            }}
          />
          <OverlayProvider>{children} </OverlayProvider>
        </AuthProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

export default Providers;
