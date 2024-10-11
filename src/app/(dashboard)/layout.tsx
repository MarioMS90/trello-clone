import Header from '@/components/dashboard/header';
import { SideNavSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
  sidenav,
}: Readonly<{
  children: React.ReactNode;
  sidenav: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex grow overflow-y-auto">
        <Suspense fallback={<SideNavSkeleton />}>{sidenav}</Suspense>
        <main className="grow overflow-y-auto bg-main-background pb-20 pl-8 pt-6 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
