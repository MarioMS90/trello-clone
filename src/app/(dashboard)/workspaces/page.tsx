import BoardsIcon from '@/components/icons/boards';
import StarIcon from '@/components/icons/star';
import UserIcon from '@/components/icons/user';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default function Page() {
  const workspaces = [
    {
      id: 'a0a3a1c4-ac37-4409-8017-6b50bf664a45',
      name: 'Mario workspace',
      boards: [
        {
          id: '1',
          name: 'My board',
          marked: true,
        },
        {
          id: '2',
          name: 'Another board',
        },
      ],
    },
    {
      id: '2',
      name: 'Work',
      boards: [
        {
          id: '3',
          name: 'Work board',
        },
        {
          id: '4',
          name: 'Another work board',
          marked: true,
        },
      ],
    },
  ];

  const markedBoards = workspaces.flatMap(workspace =>
    workspace.boards.filter(board => board.marked),
  );

  return (
    <div className="space-y-16 p-4 text-white">
      {workspaces.length && (
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 font-bold">
              <StarIcon height="24px" />
              <h2>Marked boards</h2>
            </div>
            <ul className="mt-4 flex flex-wrap gap-4">
              {markedBoards.map(board => (
                <li key={board.id}>
                  <Link href={`/boards/${board.id}`}>
                    <div className="flex h-20 w-44 items-center justify-center rounded bg-white text-sm text-primary hover:opacity-90">
                      {board.name}
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
                          <div className="flex items-center gap-2 rounded bg-gray-300 px-2 py-1.5 text-primary text-white hover:bg-opacity-90">
                            <BoardsIcon height="16px" /> Boards
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/workspaces/${workspace.id}/members`}>
                          <div className="flex items-center gap-2 rounded bg-gray-300 px-2 py-1.5 text-primary text-white hover:bg-opacity-90">
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
                          <div className="flex h-20 w-44 items-center justify-center rounded bg-white text-sm text-primary hover:opacity-90">
                            {board.name}
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
        type="button">
        <p>Create a new workspace</p>
      </button>
    </div>
  );
}
