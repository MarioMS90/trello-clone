'use client';

import { useState } from 'react';
import { UserWorkspace } from '@/types/app-types';
import Link from 'next/link';
import Popover from '../ui/popover';
import ArrowDownIcon from '../icons/arrow-down';
import WorkspaceLogo from '../ui/workspace-logo';
import StarFillIcon from '../icons/star-fill';
import { CreateBoardButton } from './buttons';

export function HeaderButtons({ workspaces }: { workspaces: UserWorkspace[] }) {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const workspacesContent = (
    <ul className="space-y-4">
      {workspaces.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/workspaces/${id}`}>
            <div className="flex items-center gap-2">
              <WorkspaceLogo className="size-10" workspaceName={name} />
              <h3 className="font-medium">{name}</h3>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  const markedBoardsContent = (
    <ul className="space-y-4">
      {workspaces.map(({ name: workspaceName, boards }) =>
        boards
          .filter(({ marked }) => marked)
          .map(({ id, name }) => (
            <li key={id}>
              <Link href={`/boards/${id}`}>
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <h3 className="font-medium">{name}</h3>
                    <p className=" text-gray-500">{workspaceName}</p>
                  </div>
                  <StarFillIcon className="text-yellow-400 hover:scale-125" height="16px" />
                </div>
              </Link>
            </li>
          )),
      )}
    </ul>
  );

  const buttons = [
    {
      id: 'workspaces',
      text: (
        <>
          Workspaces
          <ArrowDownIcon height="16px" />
        </>
      ),
      popoverContent: workspacesContent,
      triggerClassName: `font-medium`,
    },
    {
      id: 'marked',
      text: (
        <>
          Marked
          <ArrowDownIcon height="16px" />
        </>
      ),
      popoverContent: markedBoardsContent,
      triggerClassName: `font-medium`,
    },
    {
      id: 'create-board',
      text: 'Create board',
      popoverContent: <CreateBoardButton workspaceId="test" />,
      triggerClassName: `font-medium ml-3 bg-white bg-opacity-20 px-3 py-1.5 text-white hover:bg-opacity-30`,
    },
  ];

  return (
    <>
      {buttons.map(({ id, text, popoverContent, triggerClassName }) => (
        <Popover
          key={id}
          triggerClassName={triggerClassName}
          text={text}
          open={selectedButton === id}
          onOpenChange={isOpen => isOpen && setSelectedButton(id)}>
          {popoverContent}
        </Popover>
      ))}
    </>
  );
}
