'use client';

import BoardsIcon from '@/components/icons/boards';
import SettingsIcon from '@/components/icons/settings';
import UserIcon from '@/components/icons/user';
import Popover from '@/components/ui/popover';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import { deleteWorkspaceAction, renameWorkspaceAction } from '@/lib/actions';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function WorkspaceButtons({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [editedWorkspace, setEditedWorkspace] = useState<{
    name: string;
    isEditing: boolean;
  }>({
    name: workspaceName,
    isEditing: false,
  });

  useEffect(() => {
    if (editedWorkspace.isEditing && inputRef.current) {
      inputRef.current.focus();
      setIsPopoverOpen(false);
    }
  }, [editedWorkspace.isEditing]);

  const handleRenameWorkspace = async () => {
    setEditedWorkspace({ ...editedWorkspace, isEditing: false });
    await renameWorkspaceAction(workspaceId, editedWorkspace.name);
  };

  const handleDeleteWorkspace = async () => {
    await deleteWorkspaceAction(workspaceId);
  };

  const btnClassName =
    'flex items-center gap-1.5 rounded bg-gray-300 px-3 py-1.5 text-primary hover:bg-opacity-90 hover:bg-gray-300';

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <WorkspaceLogo workspaceName={editedWorkspace.name} />
        {editedWorkspace.isEditing ? (
          <input
            type="text"
            className="w-48 rounded-lg border-none p-2 font-bold text-primary outline-offset-0 outline-secondary"
            style={{ height: '32px' }}
            value={editedWorkspace.name}
            ref={inputRef}
            onBlur={handleRenameWorkspace}
            onChange={e => setEditedWorkspace({ ...editedWorkspace, name: e.target.value })}
          />
        ) : (
          <h3 className="font-bold">{editedWorkspace.name}</h3>
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
            open={isPopoverOpen}
            onOpenChange={isOpen => setIsPopoverOpen(isOpen)}>
            <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setEditedWorkspace({ ...editedWorkspace, isEditing: true });
                  }}>
                  Rename workspace
                </button>
              </li>
              <li>
                <button type="button" onClick={handleDeleteWorkspace}>
                  Delete workspace
                </button>
              </li>
            </ul>
          </Popover>
        </li>
        <li>
          <Link href={`/workspaces/${workspaceId}`}>
            <div className={btnClassName}>
              <BoardsIcon height={16} /> Boards
            </div>
          </Link>
        </li>
        <li>
          <Link href={`/workspaces/${workspaceId}/members`}>
            <div className={btnClassName}>
              <UserIcon height={16} /> Members
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
