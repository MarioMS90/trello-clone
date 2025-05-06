'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import EditableText from '@/components/ui/editable-text';
import { TWorkspace } from '@/types/db';
import SettingsIcon from '@/components/icons/settings';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import BoardsIcon from '@/components/icons/boards';
import UserIcon from '@/components/icons/user';
import { useWorkspaceMutation } from '@/hooks/useWorkspaceMutation';
import Popover from '../../ui/popover';
import { Boards } from '../board/boards';

export const WorkspacePreview = memo(function WorkspacePreview({
  workspace,
}: {
  workspace: TWorkspace;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateWorkspaceName, removeWorkspace } = useWorkspaceMutation();

  const name = updateWorkspaceName.isPending ? updateWorkspaceName.variables.name : workspace.name;

  const btnClassName =
    'flex items-center gap-1.5 rounded-sm bg-gray-300 px-3 py-1.5 text-primary hover:bg-gray-300/90';

  return (
    <li>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <WorkspaceBadge workspaceId={workspace.id} />
          <EditableText
            className="text-base font-bold text-white [&>input]:rounded-lg [&>input:focus]:shadow-none"
            defaultText={name}
            onEdit={text => updateWorkspaceName.mutate({ id: workspace.id, name: text })}
            editing={isEditingName}
            onEditingChange={setIsEditingName}
            editOnClick>
            <h3>{name}</h3>
          </EditableText>
        </div>
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Popover
              triggerContent={
                <>
                  <SettingsIcon height={16} /> Settings
                </>
              }
              triggerClassName={btnClassName}
              popoverClassName="px-0 [&]:w-48"
              open={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}>
              <ul className="text-sm [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left [&>li>button:hover]:bg-gray-200">
                <li>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => {
                      setIsEditingName(true);
                      setIsPopoverOpen(false);
                    }}>
                    Rename workspace
                  </button>
                </li>
                <li>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => removeWorkspace.mutate(workspace.id)}>
                    Delete workspace
                  </button>
                </li>
              </ul>
            </Popover>
          </li>
          <li>
            <Link href={`/workspaces/${workspace.id}`}>
              <div className={btnClassName}>
                <BoardsIcon height={16} /> Boards
              </div>
            </Link>
          </li>
          <li>
            <Link href={`/workspaces/${workspace.id}/members`}>
              <div className={btnClassName}>
                <UserIcon height={16} /> Members
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <Boards workspaceId={workspace.id} />
    </li>
  );
});
