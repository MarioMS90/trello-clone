'use client';

import { useState } from 'react';
import { Board, UserWorkspace } from '@/types/app-types';
import Link from 'next/link';
import Popover from '../ui/popover';
import ArrowDownIcon from '../icons/arrow-down';
import WorkspaceLogo from '../ui/workspace-logo';
import { CreateBoardForm } from './create-forms';
import { StarToggle } from './star-toggle';

export function HeaderButtons({
  workspaces,
  starredBoards,
}: {
  workspaces: UserWorkspace[];
  starredBoards: Board[];
}) {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

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

  const starredBoardsContent =
    starredBoards.length === 0 ? (
      <p className="text-center">No starred boards</p>
    ) : (
      <ul className="space-y-1">
        {starredBoards.map(({ id, name, workspaceName }) => (
          <li className="relative rounded-md px-2 py-1 hover:bg-gray-200" key={id}>
            <Link className="" href={`/boards/${id}`}>
              <h3 className="font-medium">{name}</h3>
              <p className="text-gray-500">{workspaceName}</p>
            </Link>
            <StarToggle className="[&]:right-1.5" boardId={id} starred />
          </li>
        ))}
      </ul>
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
