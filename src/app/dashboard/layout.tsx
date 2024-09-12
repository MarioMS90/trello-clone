import Header from '@/components/header';
import SideNav from '@/components/sidenav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <SideNav />
        <main className="bg-main-background grow pl-4">{children}</main>
      </div>
    </>
  );
}
