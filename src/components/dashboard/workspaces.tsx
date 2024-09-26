'use client';

import UserIcon from '@/components/icons/user';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import Link from 'next/link';
import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import BoardsIcon from '@/components/icons/boards';
import { ButtonCreateBoard } from '@/components/dashboard/buttons';
import { Boards } from './boards';

export function Workspaces() {
  const { workspaces } = useWorkspacesStore(state => state);

  return (
    <ul className="mt-6 space-y-12">
      {workspaces.map(workspace => (
        <li key={workspace.id}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <WorkspaceLogo />
              <h3 className="font-bold">{workspace.name}</h3>
            </div>
            <ul className="flex items-center gap-4 text-sm">
              <li>
                <Link href={`/workspaces/${workspace.id}`}>
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
                <Link href={`/workspaces/${workspace.id}/members`}>
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
          <Boards className="mt-6" boards={workspace.boards} extraItem={<ButtonCreateBoard />} />
        </li>
      ))}
    </ul>
  );
}
