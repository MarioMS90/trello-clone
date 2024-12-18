'use client';

import Link from 'next/link';
import BoardsIcon from '@/components/icons/boards';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import PlusIcon from '@/components/icons/plus';
import { CreateBoardPopover } from '@/components/dashboard/popovers';
import { SidebarLinks } from '@/components/dashboard/sidebar/sidebar-links';
import { SidebarBoards } from '@/components/dashboard/sidebar/sidebar-boards';
import { useState } from 'react';
import { UserWorkspace } from '@/types/app-types';
import { cn } from '@/lib/utils';

export function MainSidebar() {
  return (
    <nav
      className={`
        bg-secondary-background 
        w-[260px] 
        border-r 
        border-r-white 
        border-opacity-30 
        text-white
      `}>
      <Link href="/workspaces">
        <div className="mt-4 bg-button-selected-background py-2">
          <span className="flex items-center gap-3 px-4">
            <BoardsIcon height={16} /> Workspaces
          </span>
        </div>
      </Link>
    </nav>
  );
}

export function WorkspaceSidebar({
  workspace,
  boardId,
}: {
  workspace: UserWorkspace;
  boardId?: string;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <nav
      className={cn('bg-secondary-background relative w-[260px] text-white transition-all', {
        'w-6': !sidebarExpanded,
      })}>
      {!sidebarExpanded && (
        <button
          className="bg-secondary-background hover:bg-primary-background group absolute inset-0 border-r border-r-white border-opacity-30 transition-colors"
          type="button"
          onClick={() => setSidebarExpanded(true)}>
          <span className="bg-secondary-background group-hover:bg-primary-background absolute top-4 -rotate-90 rounded-full border border-white border-opacity-30 p-1 transition-colors">
            <ArrowDownIcon height={15} />
          </span>
        </button>
      )}
      <div
        className={cn(
          'bg-secondary-background absolute bottom-0 left-0 top-0 w-[260px] border-r border-r-white border-opacity-30 transition-transform',
          {
            '-translate-x-full': !sidebarExpanded,
          },
        )}>
        <div className="border-b border-b-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WorkspaceLogo workspaceName={workspace.name} />
              <h2 className="pr-4 text-sm font-bold">{workspace.name}</h2>
            </div>
            {sidebarExpanded && (
              <button
                className={cn('p-1.5', {
                  'rotate-90 rounded p-1.5 hover:bg-white/20': sidebarExpanded,
                })}
                type="button"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                <ArrowDownIcon height={15} />
              </button>
            )}
          </div>
        </div>
        <div className="text-sm">
          <SidebarLinks workspace={workspace} />
          <div className="flex items-center justify-between pl-4 pr-2.5">
            <h3 className="mb-3 mt-4 font-bold">Your boards</h3>
            <CreateBoardPopover
              workspaceId={workspace.id}
              triggerClassName="[&]:px-1.5"
              buttonText={<PlusIcon height={16} />}
            />
          </div>
          <SidebarBoards boards={workspace.boards} boardId={boardId} />
        </div>
      </div>
    </nav>
  );
}
