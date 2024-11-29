'use client';

import { Task } from '@/types/app-types';
import DotsIcon from '../icons/dots';
import PlusIcon from '../icons/plus';
import PencilIcon from '../icons/pencil';

export function TaskList({ listName, tasks }: { listName: string; tasks: Task[] }) {
  return (
    <div className="w-[272px] rounded-xl bg-gray-200 p-2 text-sm text-primary">
      <div className="flex cursor-pointer items-center justify-between">
        <textarea
          className="grow cursor-pointer resize-none overflow-hidden rounded-lg bg-transparent px-2.5 py-1.5 font-semibold outline-secondary focus-within:cursor-text focus-visible:bg-white"
          style={{ height: '32px' }}
          value={listName}></textarea>
        <span className="relative flex size-8 cursor-pointer rounded-lg hover:bg-gray-300">
          <span className="center-xy">
            <DotsIcon width={16} height={16} />
          </span>
        </span>
      </div>
      {!!tasks.length && (
        <ul className="flex flex-col gap-2 pt-2">
          {tasks.map(({ id, name }) => (
            <li
              className="group cursor-pointer rounded-lg border border-gray-300 bg-white px-1 py-2 shadow-sm outline-2 outline-secondary hover:outline"
              key={id}>
              <div className="relative justify-between px-2">
                <h2>{name}</h2>
                <span className="center-y absolute right-0 hidden size-7 cursor-pointer rounded-full hover:bg-gray-200 group-hover:block">
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
