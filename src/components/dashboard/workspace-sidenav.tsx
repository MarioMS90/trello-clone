import { getWorkspace } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArrowDownIcon from '../icons/arrow-down';
import WorkspaceLogo from '../ui/workspace-logo';
import { WorkspaceLinks, BoardsLinks } from './nav-links';

export async function WorkspaceSideNav({
  boardId,
  workspaceId,
}: {
  boardId?: string;
  workspaceId?: string;
}) {
  // const pathname = usePathname();
  const workspace = await getWorkspace({ workspaceId, boardId });
  if (!workspace) {
    return notFound();
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
            <WorkspaceLogo />
            <h2 className="pr-4 text-sm font-bold">{workspace.name}</h2>
          </div>
          <div
            className={`
                  rotate-90 
                  cursor-pointer 
                  rounded 
                  bg-white 
                  bg-opacity-10 
                  p-1.5 
                  hover:bg-opacity-20
                `}>
            <ArrowDownIcon height="15px" />
          </div>
        </div>
      </div>
      <div className="text-sm">
        <WorkspaceLinks workspace={workspace} />
        <h3 className="mb-3 mt-4 px-4 font-bold">Your boards</h3>
        <BoardsLinks boards={workspace.boards} />
        <Link href="/workspaces/6c171c01-12ce-42a4-896a-0a0aaf2a6e96">test1</Link>
        <Link href="/boards/64ac3b47-2fcd-490a-a346-5fd5273b60d5">test2</Link>
      </div>
    </nav>
  );
}
