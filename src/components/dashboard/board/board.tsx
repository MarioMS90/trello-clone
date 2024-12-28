import { fetchTaskLists } from '@/lib/data';
import { TaskList } from '@/components/dashboard/board/task-list';
import PlusIcon from '@/components/icons/plus';

export default async function Board({ boardId }: { boardId: string }) {
  const taskLists = await fetchTaskLists(boardId);

  return (
    <ul className="scrollbar-transparent h-[calc(100% - 8px)] flex gap-4 overflow-x-auto">
      {taskLists.map(({ id, name, tasks }) => (
        <li className="h-full" key={id}>
          <TaskList listName={name} tasks={tasks} />
        </li>
      ))}
      <li>
        <button
          type="button"
          className="
            flex 
            w-[272px] 
            items-center 
            gap-2 
            rounded-xl 
            bg-white 
            bg-opacity-10 
            p-3 
            text-sm 
            text-primary 
            text-white 
            shadow 
            hover:bg-opacity-15
          ">
          <PlusIcon width={16} height={16} />
          {taskLists.length ? 'Add another list' : 'Add a list'}
        </button>
      </li>
    </ul>
  );
}
