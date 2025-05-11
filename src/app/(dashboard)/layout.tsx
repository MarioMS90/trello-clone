import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { RealTimeProvider } from '@/providers/real-time-provider';
import { cookies } from 'next/headers';
import invariant from 'tiny-invariant';
import { SessionUpdater } from '@/lib/supabase/session-updater';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.getAll().find(({ name }) => name.endsWith('auth-token'));
  invariant(authCookie);

  return (
    <ReactQueryProvider>
      <SessionUpdater authCookie={authCookie}>
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
      </SessionUpdater>
    </ReactQueryProvider>
  );
}
