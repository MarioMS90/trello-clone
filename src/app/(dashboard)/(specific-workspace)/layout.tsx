import { SideNavSkeleton } from '@/components/dashboard/skeletons';
import { Suspense } from 'react';

export default function SpecificWorkspaceLayout({
  children,
  sidenav,
}: Readonly<{
  children: React.ReactNode;
  sidenav: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<SideNavSkeleton />}>{sidenav}</Suspense>
      <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
    </>
  );
}
