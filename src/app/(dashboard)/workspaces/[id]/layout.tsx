import { WorkspaceSideNav } from '@/components/dashboard/workspace-sidenav';

export default function SpecificWorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  return (
    <>
      <WorkspaceSideNav workspaceId={params.id} />

      <main className="grow bg-main-background pl-8 pt-6 text-white">{children}</main>
    </>
  );
}
