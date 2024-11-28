'use client';

import { Task } from '@/types/app-types';
import DotsIcon from '../icons/dots';
import PlusIcon from '../icons/plus';
import PencilIcon from '../icons/pencil';

export function TaskList({ listName, tasks }: { listName: string; tasks: Task[] }) {
  return (
    <div className="w-[272px] rounded-xl bg-gray-200 p-2 text-sm text-primary">
      <div className="flex cursor-pointer items-center justify-between px-2">
        <h2 className="cursor-pointer font-semibold">{listName}</h2>
        <span className="relative flex size-8 cursor-pointer rounded-lg hover:bg-gray-300">
          <span className="center-xy">
            <DotsIcon width={16} height={16} />
          </span>
        </span>
      </div>
      {!!tasks.length && (
        <ul className="flex flex-col gap-1.5 pt-3">
          {tasks.map(({ id, name }) => (
            <li
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-2 py-2.5 shadow-sm hover:[&>span]:block"
              key={id}>
              <div className="flex items-center justify-between px-2">
                <h2>{name}</h2>
                <span className="relative hidden size-7 cursor-pointer rounded-full hover:bg-gray-200">
                  <span className="center-xy">
                    <PencilIcon width={11} height={11} />
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-300">
          <PlusIcon width={16} height={16} />
          Add a card
        </button>
      </div>
    </div>
  );
}
