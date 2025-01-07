'use client';

import { CreateBoardPopover } from '@/components/dashboard/popovers';
import { BoardList } from '@/components/dashboard/boards/boards';
import { UserWorkspace } from '@/types/app-types';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import BoardsIcon from '@/components/icons/boards';
import SettingsIcon from '@/components/icons/settings';
import UserIcon from '@/components/icons/user';
import Popover from '@/components/ui/popover';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import { deleteWorkspaceAction, updateWorkspaceAction } from '@/lib/actions';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function WorkspaceList({ workspaces }: { workspaces: UserWorkspace[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const {
    optimisticList: optimisticWorkspaces,
    isPending,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(workspaces, {
    updateAction: updateWorkspaceAction,
    deleteAction: deleteWorkspaceAction,
  });

  useEffect(() => {
    if (editingWorkspaceId && inputRef.current) {
      inputRef.current.select();
      setSelectedButton(null);
    }
  }, [editingWorkspaceId]);

  const btnClassName =
    'flex items-center gap-1.5 rounded bg-gray-300 px-3 py-1.5 text-primary hover:bg-opacity-90 hover:bg-gray-300';

  return (
    <ul className={`mt-6 space-y-12 ${workspaces.length ? 'mb-16' : ''}`}>
      {optimisticWorkspaces.map(workspace => (
        <li key={workspace.id}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <WorkspaceBadge workspaceName={workspace.name} />
              {editingWorkspaceId === workspace.id && !isPending ? (
                <input
                  type="text"
                  className="w-48 rounded-lg border-none p-2 font-bold text-primary outline-offset-0 outline-secondary"
                  style={{ height: '32px' }}
                  defaultValue={workspace.name}
                  ref={inputRef}
                  onBlur={e => {
                    const newName = e.target.value.trim();
                    if (newName && workspace.name !== newName) {
                      optimisticUpdate({ id: workspace.id, name: newName });
                    }

                    setEditingWorkspaceId(null);
                  }}
                  onKeyUp={e => e.key === 'Enter' && e.currentTarget.blur()}
                />
              ) : (
                <button
                  type="button"
                  className="font-bold"
                  onMouseUp={() => {
                    setEditingWorkspaceId(workspace.id);
                  }}>
                  <h3>{workspace.name}</h3>
                </button>
              )}
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
                  open={selectedButton === workspace.id}
                  onOpenChange={isOpen => isOpen && setSelectedButton(workspace.id)}>
                  <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWorkspaceId(workspace.id);
                        }}>
                        Rename workspace
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => optimisticDelete(workspace)}>
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

          <BoardList
            className="mt-6"
            boards={workspace.boards}
            extraItem={<CreateBoardPopover workspaceId={workspace.id} />}
          />
        </li>
      ))}
    </ul>
  );
}
