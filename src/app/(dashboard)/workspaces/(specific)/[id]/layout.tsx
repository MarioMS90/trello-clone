import SpecificWorkspaceLayout from '@/components/dashboard/layouts';

export default function Layout({
  params,
  children,
}: Readonly<{
  params: { id: string };
  children: React.ReactNode;
}>) {
  return <SpecificWorkspaceLayout workspaceId={params.id}>{children}</SpecificWorkspaceLayout>;
}
