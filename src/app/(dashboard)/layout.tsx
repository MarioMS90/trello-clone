import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { RealTimeProvider } from '@/providers/real-time-provider';
import UpdateSession from '@/lib/supabase/update-session';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <UpdateSession />
      <RealTimeProvider>
        <div className="flex h-dvh flex-col">
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>

          <main className="flex grow">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar />
            </Suspense>

            <div className="bg-main-background grow text-white">{children}</div>
          </main>
        </div>
      </RealTimeProvider>
    </ReactQueryProvider>
  );
}
