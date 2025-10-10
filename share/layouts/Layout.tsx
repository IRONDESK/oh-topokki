import React from "react";
import Navigation from "@/share/layouts/Navigation";
import { mainContainer } from "@/share/layouts/css/layout.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={mainContainer}>
      {children}
      <Navigation />
    </main>
  );
}
