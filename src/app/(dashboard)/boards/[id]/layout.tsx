import Header from '@/components/dashboard/header';
import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';
import { SideNavSkeleton } from '@/components/dashboard/skeletons';
import { Suspense } from 'react';

export default async function Layout({
  params,
  children,
}: Readonly<{
  params: { id: string };
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <Suspense fallback={<SideNavSkeleton />}>
          <WorkspaceSideNav boardId={params.id} />
        </Suspense>
        <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
      </div>
    </>
  );
}
