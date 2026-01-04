"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { OverlayProvider } from "overlay-kit";
import { Provider as JotaiProvider } from "jotai";
import { Toaster } from "sonner";
import { typo } from "@/style/typo.css";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({});

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <AuthProvider>
          <Toaster
            duration={2000}
            position="top-center"
            className={typo({
              size: "body3",
              weight: "medium",
            })}
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
