'use client';

import { useState } from 'react';
import { Board, UserWorkspace } from '@/types/app-types';
import Link from 'next/link';
import { updateBoardAction } from '@/lib/actions';
import { useOptimisticMutation } from '@/app/hooks/useOptimisticMutation';
import Popover from '@/components/ui/popover';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import { CreateBoardForm } from '@/components/dashboard/create-forms';
import { StarToggleBoard } from '@/components/dashboard/star-toggle-board';

export default function HeaderButtons({
  workspaces,
  starredBoards,
}: {
  workspaces: UserWorkspace[];
  starredBoards: Board[];
}) {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const { optimisticList: optimisticBoards, optimisticUpdate } = useOptimisticMutation(
    starredBoards,
    {
      updateAction: updateBoardAction,
    },
  );

  const workspacesContent = (
    <ul className="space-y-1">
      {workspaces.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/workspaces/${id}`}>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-200">
              <WorkspaceLogo className="size-10" workspaceName={name} />
              <h3 className="font-medium">{name}</h3>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  const starredBoardsContent = optimisticBoards.some(({ starred }) => starred) ? (
    <ul className="space-y-1">
      {optimisticBoards.map(({ id, name, workspaceName }) => (
        <li className="relative rounded-md px-2 py-1 hover:bg-gray-200" key={id}>
          <Link className="" href={`/boards/${id}`}>
            <h3 className="font-medium">{name}</h3>
            <p className="text-gray-500">{workspaceName}</p>
          </Link>
          <StarToggleBoard
            className="[&]:right-1.5"
            onStarToggle={() => optimisticUpdate({ id, name, starred: false } as Board)}
            starred
          />
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center">No starred boards</p>
  );

  const buttons = [
    {
      id: 'workspaces',
      text: (
        <>
          Workspaces
          <ArrowDownIcon height={16} />
        </>
      ),
      popoverContent: workspacesContent,
      triggerClassName: `font-medium`,
    },
    {
      id: 'Starred',
      text: (
        <>
          Starred
          <ArrowDownIcon height={16} />
        </>
      ),
      popoverContent: starredBoardsContent,
      triggerClassName: `font-medium mr-3`,
    },
    {
      id: 'create-board',
      text: 'Create board',
      popoverContent: (
        <CreateBoardForm workspaces={workspaces} onSubmitSuccess={() => setSelectedButton(null)} />
      ),
      triggerClassName: `font-medium bg-white bg-opacity-20 px-3 py-1.5 text-white hover:bg-opacity-30`,
    },
  ];

  return (
    <>
      {buttons.map(({ id, text, popoverContent, triggerClassName }) => (
        <Popover
          key={id}
          triggerClassName={triggerClassName}
          triggerContent={text}
          open={selectedButton === id}
          onOpenChange={isOpen => isOpen && setSelectedButton(id)}>
          {popoverContent}
        </Popover>
      ))}
    </>
  );
}
