import { mainContainer } from '@/share/layouts/layout.css';
import Header from '@/share/layouts/Header';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={mainContainer}>
      <Header />
      {children}
    </main>
  );
}
