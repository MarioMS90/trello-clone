import { Metadata } from 'next';
import { fetchTaskLists } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taskLists = await fetchTaskLists(id);

  return (
    <>
      <h2 className="font-bold">Tasks lists</h2>
      <div>
        {taskLists.map(taskList => (
          <div key={taskList.id}>{taskList.name}</div>
        ))}
      </div>
    </>
  );
}
