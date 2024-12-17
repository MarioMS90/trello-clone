import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex flex-1">
        <Suspense fallback={<SidebarSkeleton />}>{sidebar}</Suspense>
        <main className="flex-1 overflow-hidden bg-main-background p-5 pb-20 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
