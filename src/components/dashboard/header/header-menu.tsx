'use client';

import Link from 'next/link';
import Popover from '@/components/ui/popover';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import { CreateBoard } from '@/components/dashboard/board/create-board';
import { StarToggleBoard } from '@/components/dashboard/board/star-toggle-board';
import { useWorkspaces } from '@/lib/workspace/queries';
import { useStarredBoards } from '@/lib/board/queries';

export default function HeaderMenu() {
  const { data: workspaces } = useWorkspaces();
  const { data: starredBoards } = useStarredBoards();

  const workspacesContent =
    workspaces.length > 0 ? (
      <ul className="space-y-1">
        {workspaces.map(({ id, name }) => (
          <li key={id}>
            <Link href={`/workspaces/${id}`}>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-200">
                <WorkspaceBadge className="size-10" workspaceName={name} />
                <h3 className="font-medium">{name}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No workspaces</p>
    );

  const starredBoardsContent =
    starredBoards.length > 0 ? (
      <ul className="space-y-1">
        {starredBoards.map(board => (
          <li className="relative rounded-md px-2 py-1 hover:bg-gray-200" key={board.id}>
            <Link href={`/boards/${board.id}`}>
              <h3 className="font-medium">{board.name}</h3>
              <p className="text-gray-500">
                {workspaces.find(workspace => workspace.id === board.workspaceId)?.name}
              </p>
            </Link>
            <StarToggleBoard className="[&]:right-1.5" boardId={board.id} />
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No starred boards</p>
    );

  const menuItems = [
    <Popover
      triggerClassName="font-medium"
      triggerContent={
        <>
          Workspaces
          <ArrowDownIcon height={16} />
        </>
      }
      key="workspaces">
      {workspacesContent}
    </Popover>,
    <Popover
      triggerClassName="font-medium mr-3"
      triggerContent={
        <>
          Starred
          <ArrowDownIcon height={16} />
        </>
      }
      key="Starred">
      {starredBoardsContent}
    </Popover>,
    <CreateBoard
      triggerClassName="font-medium bg-white/20 px-3 py-1.5 text-white hover:bg-white/30"
      workspaces={workspaces}
      buttonText="Create board"
      redirectToNewBoard
      key="Create board"
    />,
  ];

  return <>{menuItems.map(item => item)}</>;
}
