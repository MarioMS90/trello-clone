'use client';

import { useState } from 'react';
import Popover from '../ui/popover';

export function CreateWorkspacePopover() {
  return (
    <Popover text="Create a new workspace">
      <div className="flex flex-col items-center">
        <h2 className="text-sm">Create workspace</h2>
        <form>
          <label htmlFor="workspace-title">
            Workspace title
            <input type="text" />
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
      <div className="flex flex-col text-sm text-gray-700">
        <h2 className="mb-2 text-center font-semibold">Create board</h2>
        <form>
          <label className="text-xs font-bold" htmlFor="board-title">
            Board title <span className="text-red-500">*</span>
            <input
              className="mb-5 mt-1 w-full rounded border border-gray-500 px-3 py-2 outline-secondary"
              type="text"
            />
          </label>

          <button
            className="w-full rounded bg-secondary px-3 py-2 text-sm font-medium text-white"
            type="submit"
            onClick={handleClick}>
            Create
          </button>
        </form>
      </div>
    </Popover>
  );
}
