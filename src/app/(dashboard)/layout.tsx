import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import { createClient } from '@/lib/supabase/server';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { RealTimeProvider } from '@/providers/real-time-provider';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return notFound();
  }

  return (
    <ReactQueryProvider
      currentSession={{ accessToken: session.access_token, refreshToken: session.refresh_token }}>
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
