import Header from '@/components/header';
import SideNav from '@/components/sidenav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-primary-background flex h-full flex-col">
      <Header />
      <div className="flex h-full">
        <SideNav />
        <main className="pl-4">{children}</main>
      </div>
    </div>
  );
}
