import Header from '@/components/dashboard/header';
import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';
import { SideNavSkeleton } from '@/components/dashboard/skeletons';
import { Suspense } from 'react';

export default function SpecificWorkspaceLayout({
  workspaceId,
  boardId,
  children,
}: Readonly<{
  workspaceId?: string;
  boardId?: string;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <Suspense fallback={<SideNavSkeleton />}>
          <WorkspaceSideNav workspaceId={workspaceId} boardId={boardId} />
        </Suspense>
        <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
      </div>
    </>
  );
}
