import UserIcon from '@/components/icons/user';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import Link from 'next/link';
import BoardsIcon from '@/components/icons/boards';
import { CreateBoardPopover } from '@/components/dashboard/buttons';
import { fetchWorkspaces } from '@/lib/data';
import { BoardList } from './boards';

export async function Workspaces() {
  const workspaces2 = await fetchWorkspaces();

  const workspaces = [...workspaces2, ...workspaces2, ...workspaces2];

  return (
    <ul className="mt-6 space-y-12">
      {workspaces.map(({ id, name, boards }) => (
        <li key={id}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <WorkspaceLogo />
              <h3 className="font-bold">{name}</h3>
            </div>
            <ul className="flex items-center gap-4 text-sm">
              <li>
                <Link href={`/workspaces/${id}`}>
                  <div
                    className={`
                      flex 
                      items-center 
                      gap-2 
                      rounded 
                      bg-gray-300 
                      px-2 
                      py-1.5 
                      text-primary 
                      hover:bg-opacity-90
                    `}>
                    <BoardsIcon height="16px" /> Boards
                  </div>
                </Link>
              </li>
              <li>
                <Link href={`/workspaces/${id}/members`}>
                  <div
                    className={`
                      flex 
                      items-center 
                      gap-2 
                      rounded 
                      bg-gray-300 
                      px-2 
                      py-1.5 
                      text-primary 
                      hover:bg-opacity-90
                    `}>
                    <UserIcon height="16px" /> Members
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <BoardList
            className="mt-6"
            boards={boards}
            extraItem={<CreateBoardPopover workspaceId={id} />}
          />
        </li>
      ))}
    </ul>
  );
}
