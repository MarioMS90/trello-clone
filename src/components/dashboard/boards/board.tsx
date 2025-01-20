import { fetchLists } from '@/lib/data';
import BoardLists from '@/components/dashboard/boards/board-lists';

export default async function Board({ boardId }: { boardId: string }) {
  const lists = await fetchLists(boardId);

  return (
    <div className="relative h-[calc(100%-8px)]">
      {/* position: absolute needed for max-height:100% to be respected internally */}
      <div className="absolute inset-0">
        <BoardLists boardId={boardId} initialLists={lists} />
      </div>
    </div>
  );
}
