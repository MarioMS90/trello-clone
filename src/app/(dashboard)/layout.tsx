import Header from '@/components/dashboard/header/header';
import { MainProvider } from '@/providers/main-provider';
import { LayoutSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <MainProvider>
        <div className="flex h-dvh flex-col">
          <Header />
        </div>
        {/* <main className="z-0 flex grow">
          {sidebar} Pending
          <div className="grow bg-main-background text-white">{children}</div>
        </main> */}
      </MainProvider>
    </Suspense>
  );
}
