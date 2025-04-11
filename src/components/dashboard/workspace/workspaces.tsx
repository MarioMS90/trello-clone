'use client';

import { BoardList } from '@/components/dashboard/board/boards';
import BoardsIcon from '@/components/icons/boards';
import SettingsIcon from '@/components/icons/settings';
import UserIcon from '@/components/icons/user';
import Popover from '@/components/ui/popover';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import EditableText from '@/components/ui/editable-text';
import { useWorkspaces } from '@/lib/workspace/queries';
import { useMutation } from '@tanstack/react-query';
import { deleteWorkspace, updateWorkspace } from '@/lib/workspace/actions';
import { useBoards } from '@/lib/board/queries';
import useOptimisticMutation from '@/hooks/useOptimisticMutation';
import { CreateBoard } from '../board/create-board';

export default function Workspaces() {
  const { data: workspaces } = useWorkspaces();
  const { data: boards } = useBoards();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    if (editingWorkspaceId && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingWorkspaceId]);

  const [{ mutate: updateWorkspaceAction }, optimisticWorkspaces] = useOptimisticMutation({
    state: workspaces,
    updater: (current, variables) =>
      current.map(workspace =>
        workspace.id === variables.id ? { ...workspace, name: variables.name } : workspace,
      ),
    options: {
      mutationFn: async (data: { id: string; name: string }) => {
        updateWorkspace(data);
      },
      onError: () => {
        alert('An error occurred while updating the element');
      },
    },
  });

  const { mutate: removeWorkspaceAction } = useMutation({
    mutationFn: async (workspaceId: string) => {
      deleteWorkspace(workspaceId);
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  const btnClassName =
    'flex items-center gap-1.5 rounded bg-gray-300 px-3 py-1.5 text-primary hover:bg-opacity-90 hover:bg-gray-300';

  return (
    <ul className={`mt-6 space-y-12 ${workspaces.length ? 'mb-16' : ''}`}>
      {optimisticWorkspaces.map(({ id, name }) => (
        <li key={id}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <WorkspaceBadge workspaceName={name} />
              <EditableText
                className="text-base font-bold text-white [&>input:focus]:shadow-none [&>input]:w-48 [&>input]:rounded-lg"
                defaultText={name}
                onEdit={text => updateWorkspaceAction({ id, name: text })}
                editing={editingWorkspaceId === id}
                onEditingChange={isEditing => {
                  if (isEditing) {
                    setEditingWorkspaceId(id);
                  } else {
                    setEditingWorkspaceId(null);
                  }
                }}
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
                  popoverClassName="px-0 [&]:w-48">
                  <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWorkspaceId(id);
                        }}>
                        Rename workspace
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => removeWorkspaceAction(id)}>
                        Delete workspace
                      </button>
                    </li>
                  </ul>
                </Popover>
              </li>
              <li>
                <Link href={`/workspaces/${id}`}>
                  <div className={btnClassName}>
                    <BoardsIcon height={16} /> Boards
                  </div>
                </Link>
              </li>
              <li>
                <Link href={`/workspaces/${id}/members`}>
                  <div className={btnClassName}>
                    <UserIcon height={16} /> Members
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <BoardList
            className="mt-6"
            boards={boards.filter(board => board.workspaceId === id)}
            extraItem={
              <CreateBoard
                popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
                workspaceId={id}
              />
            }
          />
        </li>
      ))}
    </ul>
  );
}
