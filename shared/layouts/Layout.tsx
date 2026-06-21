import React, { Suspense } from "react";
import Navigation from "@/shared/layouts/Navigation";
import { mainContainer } from "@/shared/layouts/css/layout.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={mainContainer}>
      {children}
      <Suspense fallback={<div />}>
        <Navigation />
      </Suspense>
    </main>
  );
}
