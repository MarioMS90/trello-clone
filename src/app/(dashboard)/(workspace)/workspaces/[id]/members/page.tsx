import Members from '@/modules/workspace/components/members';
import { MembersSkeleton } from '@/modules/common/components/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params;

  return (
    <div className="main-container px-26">
      <Suspense fallback={<MembersSkeleton />}>
        <Members workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
