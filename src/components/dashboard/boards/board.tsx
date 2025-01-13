import { fetchColumns } from '@/lib/data';
import Columns from '@/components/dashboard/boards/columns';

export default async function Board({ boardId }: { boardId: string }) {
  const columns = await fetchColumns(boardId);

  return (
    <div className="relative h-full">
      {/* position: absolute needed for max-height:100% to be respected internally */}
      <div className="absolute inset-0">
        <Columns initialColumns={columns} />
      </div>
    </div>
  );
}
