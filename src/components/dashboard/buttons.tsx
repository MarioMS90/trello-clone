'use client';

import { useWorkspacesStore } from '@/providers/workspaces-store-provider';

function Button({ text, handler }: { text: string; handler: () => void }) {
  return (
    <button
      className={`
          flex 
          h-20 
          w-44 
          items-center 
          justify-center 
          rounded 
          bg-gray-300 
          text-sm 
          text-primary 
          hover:opacity-90
        `}
      type="button"
      onClick={handler}>
      <p>{text}</p>
    </button>
  );
}

export function ButtonCreateWorkspace() {
  const { addWorkspace } = useWorkspacesStore(state => state);

  const handleCreateWorkspace = () => {
    // addWorkspace();
  };

  return <Button text="Create a new workspace" handler={handleCreateWorkspace} />;
}

export function ButtonCreateBoard() {
  'use client';

  // const { addBoard } = useWorkspacesStore(state => state);

  const handleCreateBoard = () => {
    // addBoard();
  };

  return <Button text="Create a new board" handler={handleCreateBoard} />;
}
