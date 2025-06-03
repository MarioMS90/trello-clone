'use client';

import { useWorkspaces } from '@/modules/workspace/lib/queries';
import { WorkspacePreview } from '@/modules/workspace/components/workspace-preview';

export default function Workspaces() {
  const { data: workspaces } = useWorkspaces();

  return (
    <ul className={`mt-6 space-y-12 ${workspaces.length ? 'mb-16' : ''}`}>
      {workspaces.map(workspace => (
        <WorkspacePreview workspace={workspace} key={workspace.id} />
      ))}
    </ul>
  );
}
