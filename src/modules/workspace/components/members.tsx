'use client';

import { useWorkspace } from '@/modules/workspace/lib/queries';
import { useMembers } from '@/modules/user/lib/queries';
import WorkspaceBadge from '@/modules/common/components/ui/workspace-logo';
import EditableText from '@/modules/common/components/ui/editable-text';
import { useState } from 'react';
import { useWorkspaceMutation } from '@/modules/workspace/hooks/useWorkspaceMutation';
import PencilIcon from '@/modules/common/components/icons/pencil';
import { notFound } from 'next/navigation';
import Member from '@/modules/workspace/components/member';
import AddMember from '@/modules/workspace/components/add-member';

export default function Members({ workspaceId }: { workspaceId: string }) {
  const { data: workspace } = useWorkspace(workspaceId);
  const members = useMembers(workspaceId);
  const [isEditing, setIsEditing] = useState(false);
  const { modifyWorkspace } = useWorkspaceMutation();

  if (!workspace) {
    notFound();
  }

  const workspaceName =
    modifyWorkspace.isPending && modifyWorkspace.variables.name
      ? modifyWorkspace.variables.name
      : workspace.name;

  return (
    <div className="mx-auto max-w-[1250px] px-26">
      <section className="mx-auto flex max-w-[850px] items-center justify-between pt-4 pb-8">
        <div className="flex items-center gap-3">
          <WorkspaceBadge className="size-14 text-3xl" workspaceId={workspaceId} />

          <EditableText
            className="[&>input]:field-sizing-content [&>input]:text-xl [&>input]:font-semibold [&>input:focus]:shadow-none"
            defaultText={workspaceName}
            onEdit={text => {
              modifyWorkspace.mutate({ id: workspace.id, name: text });
            }}
            editing={isEditing}
            onEditingChange={setIsEditing}>
            <h2 className="text-xl font-semibold">{workspaceName}</h2>
          </EditableText>

          <button
            className="hover:bg-button-hovered-background cursor-pointer rounded-sm p-2"
            type="button"
            onClick={() => setIsEditing(true)}>
            <PencilIcon width={12} height={12} />
          </button>
        </div>
        <AddMember workspaceId={workspaceId} />
      </section>
      <section className="border-t-1 border-t-white/20 pt-6">
        <h2 className="font-bold">Workspace members ({members.length})</h2>
        <p>
          Workspace members can view and join all Workspace visible boards and create new boards in
          the Workspace.
        </p>
        <ul className="pt-6">
          {members.map(member => (
            <Member member={member} key={member.roleId} />
          ))}
        </ul>
      </section>
    </div>
  );
}
