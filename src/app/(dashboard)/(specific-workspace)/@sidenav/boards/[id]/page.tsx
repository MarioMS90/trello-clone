import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';

export default function BoardSidenavPage({ params }: { params: { id: string } }) {
  return <WorkspaceSideNav boardId={params.id} />;
}
