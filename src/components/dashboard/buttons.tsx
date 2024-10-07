'use client';

import { testAction } from '@/lib/actions';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { set } from 'zod';

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
      type="submit"
      onClick={handler}>
      <p>{text}</p>
    </button>
  );
}

export function ButtonCreateWorkspace() {
  // const [errorMessage, formAction] = useFormState(testAction, undefined);
  const [isPending, setIsPending] = useState(false);

  const handleCreateWorkspace = () => {
    setIsPending(true);
    testAction();
  };

  return (
    <>
      {isPending ? <p>Creating workspace...</p> : <p>Not creating</p>}
      <Button text="Create a new workspace" handler={handleCreateWorkspace} />
    </>
  );
}

export function ButtonCreateBoard() {
  // const { addBoard } = useWorkspacesStore();

  const handleCreateBoard = () => {
    // addBoard();
  };

  return <Button text="Create a new board" handler={handleCreateBoard} />;
}
