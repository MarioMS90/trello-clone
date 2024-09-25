import Header from '@/components/header';
import SideNav from '@/components/sidenav';
import { fetchUserWorkspaces } from '@/lib/data';
import { WorkspacesStoreProvider } from '@/providers/workspaces-store-provider';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workspaces = await fetchUserWorkspaces();

  return (
    <WorkspacesStoreProvider workspaces={workspaces}>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <SideNav />
        <main className="grow bg-main-background pl-4 pt-2">{children}</main>
      </div>
    </WorkspacesStoreProvider>
  );
}
