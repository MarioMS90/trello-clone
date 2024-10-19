import { getWorkspace } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersPage({ params }: { params: { id: string } }) {
  const workspace = await getWorkspace({ workspaceId: params.id });

  return <div>Members page, coming soon! 🚀{workspace.id}</div>;
}
