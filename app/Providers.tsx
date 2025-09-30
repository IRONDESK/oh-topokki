"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { OverlayProvider } from "overlay-kit";
import { Provider as JotaiProvider } from "jotai";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({});

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <AuthProvider>
          <OverlayProvider>{children} </OverlayProvider>
        </AuthProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

export default Providers;
