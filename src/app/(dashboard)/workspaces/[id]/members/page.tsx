/* eslint-disable */
import { getWorkspace } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  // const { id } = await params;
  // const workspace = await getWorkspace({ workspaceId: id });

  return <div className="main-container">Members page, coming soon! 🚀</div>;
}
