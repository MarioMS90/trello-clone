/* eslint-disable */
import { getWorkspace } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params;
  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    notFound();
  }

  return <div className="main-container">Members page, coming soon! 🚀</div>;
}
