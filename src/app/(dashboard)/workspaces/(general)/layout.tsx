import Header from '@/components/dashboard/header';
import { MainSideNav } from '@/components/dashboard/sidenavs';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <MainSideNav />
        <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
      </div>
    </>
  );
}
