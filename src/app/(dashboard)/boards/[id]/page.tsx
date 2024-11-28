import { Metadata } from 'next';
import { fetchTaskLists } from '@/lib/data';
import { TaskList } from '@/components/dashboard/task-list';
import PlusIcon from '@/components/icons/plus';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  const taskLists = await fetchTaskLists(boardId);

  return (
    <div className="relative h-full">
      <ul className="scrollbar-transparent flex h-[calc(100%-8px)] gap-4 overflow-x-auto p-3">
        {taskLists.map(({ id, name, tasks }) => (
          <li className="h-full" key={id}>
            <TaskList listName={name} tasks={tasks} />
          </li>
        ))}
        <li>
          <button
            type="button"
            className="flex w-[272px] items-center gap-2 rounded-xl bg-white bg-opacity-10 p-3 text-sm text-primary text-white shadow hover:bg-opacity-15">
            <PlusIcon width={16} height={16} />
            {taskLists.length ? 'Add another list' : 'Add a list'}
          </button>
        </li>
      </ul>
    </div>
  );
}
