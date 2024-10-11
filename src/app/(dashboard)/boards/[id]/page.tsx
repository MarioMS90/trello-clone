import { fetchTaskLists } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: { id: string } }) {
  const taskLists = await fetchTaskLists(params.id);

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
