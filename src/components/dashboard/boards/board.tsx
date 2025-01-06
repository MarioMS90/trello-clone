import { fetchCardLists } from '@/lib/data';
import PlusIcon from '@/components/icons/plus';
import { Cards } from '@/components/dashboard/boards/cards';

export default async function Board({ boardId }: { boardId: string }) {
  const cardLists = await fetchCardLists(boardId);

  return (
    <ul className="scrollbar-transparent flex h-[calc(100%-8px)] gap-4 overflow-x-auto">
      <Cards initialCardLists={cardLists} />
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
          {cardLists.length ? 'Add another list' : 'Add a list'}
        </button>
      </li>
    </ul>
  );
}
