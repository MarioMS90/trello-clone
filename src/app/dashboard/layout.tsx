import Header from '@/components/header';
import SideNav from '@/components/sidenav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="dashboard">
      <Header />
      <div className="flex">
        <SideNav />
        {children}
      </div>
    </div>
  );
}
