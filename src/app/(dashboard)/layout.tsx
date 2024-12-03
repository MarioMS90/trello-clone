import Header from '@/components/dashboard/header';
import { HeaderSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
  sidenav,
}: Readonly<{
  children: React.ReactNode;
  sidenav: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex flex-1">
        {sidenav}
        <main className="flex-1 overflow-hidden bg-main-background text-white">{children}</main>
      </div>
    </div>
  );
}
