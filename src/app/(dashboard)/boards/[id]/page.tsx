import { Metadata } from 'next';
import { fetchTaskLists } from '@/lib/data';
import { TaskList } from '@/components/dashboard/task-list';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  const taskLists = await fetchTaskLists(boardId);

  return (
    <ul className="flex gap-3">
      {taskLists.map(({ id, name, tasks }) => (
        <li key={id}>
          <TaskList listName={name} tasks={tasks} />
        </li>
      ))}
    </ul>
  );
}
