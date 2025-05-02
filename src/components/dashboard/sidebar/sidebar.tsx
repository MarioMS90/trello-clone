'use client';

import Link from 'next/link';
import BoardsIcon from '@/components/icons/boards';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import PlusIcon from '@/components/icons/plus';
import SidebarLinks from '@/components/dashboard/sidebar/sidebar-links';
import { useState } from 'react';
import { TWorkspace } from '@/types/db';
import { cn } from '@/lib/utils/utils';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useWorkspace } from '@/lib/workspace/queries';
import { useBoards } from '@/lib/board/queries';
import { CreateBoard } from '../board/create-board';
import { SidebarBoard } from './sidebar-board';

export function Sidebar() {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useWorkspace(workspaceId);

  return workspace ? <WorkspaceSidebar workspace={workspace} /> : <MainSidebar />;
}

export function MainSidebar() {
  return (
    <nav className="bg-secondary-background z-10 min-w-[260px] border-r border-r-white/30 text-white">
      <Link href="/workspaces">
        <div className="bg-button-selected-background mt-4 py-2">
          <span className="flex items-center gap-3 px-4">
            <BoardsIcon height={16} /> Workspaces
          </span>
        </div>
      </Link>
    </nav>
  );
}

function WorkspaceSidebar({ workspace }: { workspace: TWorkspace }) {
  const { data: boards } = useBoards(workspace.id);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <nav
      className={cn(
        'bg-secondary-background relative z-10 min-w-[260px] text-white transition-all',
        {
          'min-w-6': !sidebarExpanded,
        },
      )}>
      {!sidebarExpanded && (
        <button
          className="group bg-secondary-background hover:bg-primary-background absolute inset-0 cursor-pointer border-r border-r-white/30 transition-colors"
          type="button"
          onClick={() => setSidebarExpanded(true)}>
          <span className="bg-secondary-background group-hover:bg-primary-background absolute top-4 -rotate-90 rounded-full border border-white/30 p-1 transition-colors">
            <ArrowDownIcon height={15} />
          </span>
        </button>
      )}
      <div
        className={cn(
          'bg-secondary-background absolute top-0 bottom-0 left-0 w-[260px] border-r border-r-white/30 transition-transform',
          {
            '-translate-x-full': !sidebarExpanded,
          },
        )}>
        <div className="border-b border-b-white/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WorkspaceBadge workspaceId={workspace.id} />
              <h2 className="pr-4 text-sm font-bold">{workspace.name}</h2>
            </div>
            {sidebarExpanded && (
              <button
                className={cn('p-1.5', {
                  'rotate-90 cursor-pointer rounded-sm p-1.5 hover:bg-white/20': sidebarExpanded,
                })}
                type="button"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                <ArrowDownIcon height={15} />
              </button>
            )}
          </div>
        </div>
        <div className="text-sm">
          <SidebarLinks workspaceId={workspace.id} />
          <div className="flex items-center justify-between pr-2.5 pl-4">
            <h3 className="mt-4 mb-3 font-bold">Your boards</h3>
            <CreateBoard
              workspaceId={workspace.id}
              triggerClassName="[&]:px-1.5"
              buttonText={<PlusIcon height={16} />}
            />
          </div>
          <ul>
            {boards.map(board => (
              <SidebarBoard board={board} key={board.id} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
