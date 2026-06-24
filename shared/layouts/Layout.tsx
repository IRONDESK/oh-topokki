import React, { Suspense } from "react";
import Navigation from "@/shared/layouts/Navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-[calc(100vh-1px)] bg-cream mx-auto overflow-hidden">
      {children}
      <Suspense fallback={<div />}>
        <Navigation />
      </Suspense>
    </main>
  );
}
