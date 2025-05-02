'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import EditableText from '@/components/ui/editable-text';
import { useBoards } from '@/lib/board/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TWorkspace } from '@/types/db';
import invariant from 'tiny-invariant';
import { deleteWorkspace, updateWorkspace } from '@/lib/workspace/actions';
import SettingsIcon from '@/components/icons/settings';
import { workspaceKeys } from '@/lib/workspace/queries';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import BoardsIcon from '@/components/icons/boards';
import UserIcon from '@/components/icons/user';
import { useCurrentUser } from '@/lib/user/queries';
import Popover from '../../ui/popover';
import { CreateBoard } from '../board/create-board';
import { BoardPreview } from '../board/board-preview';

export const WorkspacePreview = memo(function WorkspacePreview({
  workspace,
}: {
  workspace: TWorkspace;
}) {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: boards } = useBoards(workspace.id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { queryKey } = workspaceKeys.list(user.id);

  const { mutate: removeWorkspace } = useMutation({
    mutationFn: async (id: string) => deleteWorkspace(id),
    onSuccess: async ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TWorkspace[]) =>
        old.filter(_workspace => _workspace.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  const updateWorkspaceName = useMutation({
    mutationFn: async (variables: { id: string; name: string }) => updateWorkspace(variables),

    onSuccess: async ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TWorkspace[]) =>
        old.map(_workspace => (_workspace.id === data.id ? data : _workspace)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

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
                    onClick={() => removeWorkspace(workspace.id)}>
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
      <ul className="mt-6 flex flex-wrap gap-4">
        {boards.map(board => (
          <BoardPreview board={board} key={board.id} />
        ))}
        <li>
          <CreateBoard
            popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
            workspaceId={workspace.id}
          />
        </li>
      </ul>
    </li>
  );
});
