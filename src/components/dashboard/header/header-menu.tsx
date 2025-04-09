'use client';

import Link from 'next/link';
import Popover from '@/components/ui/popover';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import { CreateBoard } from '@/components/dashboard/board/create-board';
import { StarToggleBoard } from '@/components/dashboard/board/star-toggle-board';
import { useWorkspaces } from '@/lib/workspace/queries';
import { useBoards, useStarredBoards } from '@/lib/board/queries';

export default function HeaderMenu() {
  const { data: workspaces } = useWorkspaces();
  const { data: boards } = useBoards();
  const { data: starredBoardIds } = useStarredBoards();

  const workspacesContent = (
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
  );

  // const starredBoards = starredBoardIds.map(boardId => {
  //   const index = boards.findIndex(board => board.id === boardId);
  //   return boards[index];
  // });

  const starredBoards = boards;
  const starredBoardsContent =
    starredBoards.length > 0 ? (
      <ul className="space-y-1">
        {starredBoards.map(board => (
          <li className="relative rounded-md px-2 py-1 hover:bg-gray-200" key={board.id}>
            <Link href={`/boards/${board.id}`}>
              <h3 className="font-medium">{board.name}</h3>
              <p className="text-gray-500">
                {workspaces.find(w => w.id === board.workspaceId)?.name}
              </p>
            </Link>
            <StarToggleBoard
              className="[&]:right-1.5"
              board={board}
              starred={starredBoardIds.some(boardId => boardId === board.id)}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No starred boards</p>
    );

  const menuItems = [
    <Popover
      key="workspaces"
      triggerClassName="font-medium"
      triggerContent={
        <>
          Workspaces
          <ArrowDownIcon height={16} />
        </>
      }>
      {workspacesContent}
    </Popover>,
    <Popover
      open
      key="Starred"
      triggerClassName="font-medium mr-3"
      triggerContent={
        <>
          Starred
          <ArrowDownIcon height={16} />
        </>
      }>
      {starredBoardsContent}
    </Popover>,
    <CreateBoard
      key="Create board"
      triggerClassName="font-medium bg-white bg-opacity-20 px-3 py-1.5 text-white hover:bg-opacity-30"
      workspaces={workspaces}
      buttonText="Create board"
      redirectToNewBoard
    />,
  ];

  return <>{menuItems.map(item => item)}</>;
}
