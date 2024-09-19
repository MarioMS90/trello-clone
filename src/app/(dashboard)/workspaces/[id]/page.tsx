import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default function Page({ params }: { params: { id: string } }) {
  return <div>My Workspace: {params.id}</div>;
}
