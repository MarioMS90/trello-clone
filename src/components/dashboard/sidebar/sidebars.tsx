'use client';

import Link from 'next/link';
import BoardsIcon from '@/components/icons/boards';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import PlusIcon from '@/components/icons/plus';
import { CreateBoardPopover } from '@/components/dashboard/popovers';
import SidebarLinks from '@/components/dashboard/sidebar/sidebar-links';
import SidebarBoards from '@/components/dashboard/sidebar/sidebar-boards';
import { useState } from 'react';
import { TUserWorkspace } from '@/types/types';
import { cn } from '@/lib/utils/utils';

export function MainSidebar() {
  return (
    <nav
      className={`
        min-w-[260px] 
        border-r 
        border-r-white 
        border-opacity-30 
        bg-secondary-background 
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
  workspace: TUserWorkspace;
  boardId?: string;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <nav
      className={cn('relative min-w-[260px] bg-secondary-background text-white transition-all', {
        'min-w-6': !sidebarExpanded,
      })}>
      {!sidebarExpanded && (
        <button
          className="group absolute inset-0 border-r border-r-white border-opacity-30 bg-secondary-background transition-colors hover:bg-primary-background"
          type="button"
          onClick={() => setSidebarExpanded(true)}>
          <span className="absolute top-4 -rotate-90 rounded-full border border-white border-opacity-30 bg-secondary-background p-1 transition-colors group-hover:bg-primary-background">
            <ArrowDownIcon height={15} />
          </span>
        </button>
      )}
      <div
        className={cn(
          'absolute bottom-0 left-0 top-0 w-[260px] border-r border-r-white border-opacity-30 bg-secondary-background transition-transform',
          {
            '-translate-x-full': !sidebarExpanded,
          },
        )}>
        <div className="border-b border-b-white border-opacity-20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WorkspaceBadge workspaceName={workspace.name} />
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
          <SidebarBoards boards={workspace.boards} currentBoardId={boardId} />
        </div>
      </div>
    </nav>
  );
}
