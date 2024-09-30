import Header from '@/components/dashboard/header';
import SideNav from '@/components/dashboard/sidenav';
import { fetchWorkspaces } from '@/lib/data';
import { WorkspacesStoreProvider } from '@/providers/workspaces-store-provider';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workspaces = await fetchWorkspaces();

  return (
    <WorkspacesStoreProvider workspaces={workspaces}>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <SideNav />
        <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
      </div>
    </WorkspacesStoreProvider>
  );
}
