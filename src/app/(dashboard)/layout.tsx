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
    <div className="flex h-dvh flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex grow">
        <Suspense fallback={<SidebarSkeleton />}>{sidebar}</Suspense>
        <main className="grow bg-main-background text-white">{children}</main>
      </div>
    </div>
  );
}
