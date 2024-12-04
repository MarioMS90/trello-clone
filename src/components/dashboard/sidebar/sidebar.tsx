import Link from 'next/link';
import { getWorkspace, getWorkspaceIdFromBoard } from '@/lib/utils';
import { notFound } from 'next/navigation';
import BoardsIcon from '@/components/icons/boards';
import ArrowDownIcon from '@/components/icons/arrow-down';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import PlusIcon from '@/components/icons/plus';
import { CreateBoardPopover } from '@/components/dashboard/popovers';
import { SidebarLinks } from '@/components/dashboard/sidebar/sidebar-links';
import { SidebarBoards } from '@/components/dashboard/sidebar/sidebar-boards';

export function MainSidebar() {
  return (
    <nav
      className={`
        w-[260px] 
        border-r 
        border-r-white 
        border-opacity-30 
        bg-sidenav-background 
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

export async function WorkspaceSidebar({
  boardId,
  workspaceId,
  actualPageName,
}: {
  boardId?: string;
  workspaceId?: string;
  actualPageName?: string;
}) {
  const targetWorkspaceId = boardId ? await getWorkspaceIdFromBoard(boardId) : workspaceId;
  const workspace = await getWorkspace(targetWorkspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <nav
      className={`
      w-[260px] 
      border-r 
      border-r-white 
      border-opacity-30 
      bg-sidenav-background 
      text-white
    `}>
      <div className="border-b border-b-white border-opacity-20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WorkspaceLogo workspaceName={workspace.name} />
            <h2 className="pr-4 text-sm font-bold">{workspace.name}</h2>
          </div>
          <div
            className="
              rotate-90 
              cursor-pointer 
              rounded 
              bg-white 
              bg-opacity-10 
              p-1.5 
              hover:bg-opacity-20
            ">
            <ArrowDownIcon height={15} />
          </div>
        </div>
      </div>
      <div className="text-sm">
        <SidebarLinks workspace={workspace} actualPageName={actualPageName} />
        <div className="flex items-center justify-between pl-4 pr-2.5">
          <h3 className="mb-3 mt-4 font-bold">Your boards</h3>
          <CreateBoardPopover
            workspaceId={workspace.id}
            triggerClassName="px-1.5"
            buttonText={<PlusIcon height={16} />}
          />
        </div>
        <SidebarBoards boards={workspace.boards} selectedBoardId={boardId} />
      </div>
    </nav>
  );
}
