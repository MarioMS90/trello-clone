'use client';

import { useState } from 'react';
import Popover from '../ui/popover';

export function CreateWorkspacePopover() {
  return (
    <Popover text="Create a new workspace">
      <div className="flex flex-col items-center">
        <h2 className="text-sm">Create workspace</h2>
        <form>
          <label htmlFor="board-title">
            Workspace title
            <input id="board-title" type="text" />
          </label>

          <button type="submit">Create</button>
        </form>
      </div>
    </Popover>
  );
}

export function CreateBoardPopover({ workspaceId }: { workspaceId: string }) {
  const [test, setTest] = useState(1);

  function handleClick() {
    setTest(prevState => prevState + 1);
  }

  return (
    <Popover text="Create a new board">
      {test} {workspaceId}
      <div className="flex flex-col items-center">
        <h2 className="text-sm">Create board</h2>
        <form>
          <label htmlFor="board-title">
            Board title
            <input id="board-title" type="text" />
          </label>

          <button type="submit" onClick={handleClick}>
            Create
          </button>
        </form>
      </div>
    </Popover>
  );
}
