'use client';

import StarFillIcon from '@/components/icons/star-fill';
import StarIcon from '@/components/icons/star';
import UserIcon from '@/components/icons/user';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import Link from 'next/link';
import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import BoardsIcon from '@/components/icons/boards';

export default function Page() {
  const { workspaces, addWorkspace } = useWorkspacesStore(state => state);

  const handleCreateWorkspace = () => {
    addWorkspace(workspaces[0]);
  };

  const getMarkedBoards = () =>
    workspaces.flatMap(workspace => workspace.boards.filter(board => board.marked));

  return (
    <div className="space-y-16 p-4 text-white">
      {workspaces.length && (
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 font-bold">
              <StarIcon height="20px" />
              <h2>Marked boards</h2>
            </div>
            <ul className="mt-4 flex flex-wrap gap-4">
              {getMarkedBoards().map(board => (
                <li key={board.id}>
                  <Link href={`/boards/${board.id}`}>
                    <div className="relative h-20 w-44 rounded bg-white pl-4 pt-2 text-sm font-bold text-primary hover:opacity-90">
                      {board.name}
                      <StarFillIcon
                        className="absolute bottom-2 right-3 z-10 text-yellow-400 hover:scale-125"
                        height="16px"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <div className="flex items-center gap-3 font-bold">
              <h2>Your workspaces</h2>
            </div>
            <div className="space-y-8">
              {workspaces.map(workspace => (
                <div className="mt-4" key={workspace.id}>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <WorkspaceLogo />
                      <h3 className="font-bold">{workspace.name}</h3>
                    </div>
                    <ul className="flex items-center gap-4 text-sm">
                      <li>
                        <Link href={`/workspaces/${workspace.id}`}>
                          <div className="flex items-center gap-2 rounded bg-gray-300 px-2 py-1.5 text-primary hover:bg-opacity-90">
                            <BoardsIcon height="16px" /> Boards
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/workspaces/${workspace.id}/members`}>
                          <div className="flex items-center gap-2 rounded bg-gray-300 px-2 py-1.5 text-primary hover:bg-opacity-90">
                            <UserIcon height="16px" /> Members
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-4">
                    {workspace.boards.map(board => (
                      <li key={board.id}>
                        <Link href={`/boards/${board.id}`}>
                          <div className="relative h-20 w-44 rounded bg-white pl-4 pt-2 text-sm font-bold text-primary hover:opacity-90">
                            {board.name}
                            {board.marked ? (
                              <StarFillIcon
                                className="absolute bottom-2 right-3 z-10 text-yellow-400 hover:scale-125"
                                height="16px"
                              />
                            ) : (
                              <StarIcon
                                className="absolute bottom-2 right-3 z-10 hover:scale-125"
                                height="16px"
                              />
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li key={workspace.id}>
                      <button
                        className="flex h-20 w-44 items-center justify-center rounded bg-gray-300 text-sm text-primary hover:opacity-90"
                        type="button">
                        <p>Create a new board</p>
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      <button
        className="flex h-20 w-44 items-center justify-center rounded bg-gray-300 text-sm text-primary hover:opacity-90"
        type="button"
        onClick={handleCreateWorkspace}>
        <p>Create a new workspace</p>
      </button>
    </div>
  );
}
