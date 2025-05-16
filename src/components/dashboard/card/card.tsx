'use client';

import CloseIcon from '@/components/icons/close';
import EditableText from '@/components/ui/editable-text';
import { useCard } from '@/lib/card/queries';
import { listKeys } from '@/lib/list/queries';
import { useSharedStore } from '@/stores/shared-store';
import { useQueryClient } from '@tanstack/react-query';
import { useClickAway } from '@uidotdev/usehooks';
import { notFound, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ListSelector = dynamic(() => import('./list-selector'), { ssr: false });

export default function Card({ cardId }: { cardId: string }) {
  const queryClient = useQueryClient();
  const { setIdentifiers } = useSharedStore(state => state);
  const router = useRouter();
  const { data: card } = useCard(cardId);

  if (!card) {
    notFound();
  }

  useEffect(() => {
    setIdentifiers({ workspaceId: card.workspaceId as string, boardId: card.boardId });
  }, [setIdentifiers, card]);

  queryClient.prefetchQuery(listKeys.detail(card.listId));

  const clickAwayRef = useClickAway<HTMLDivElement>(event => {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    if (event.button !== 0 && event.button !== 2) {
      return;
    }

    closeCard();
  });

  const closeCard = () => {
    router.push(`/boards/${card.boardId}`);
  };

  return (
    <div className="scrollbar-stable text-primary fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/75">
      <div
        className="center-x fixed top-12 flex w-auto flex-col rounded-xl bg-neutral-200 px-5 py-4 md:w-[768px]"
        ref={clickAwayRef}>
        <EditableText
          className="mr-[74px] [&>textarea]:text-xl [&>textarea]:font-semibold"
          defaultText={card.name}
          onEdit={text => {
            console.log('text', text);
          }}
          editOnClick
          autoResize>
          <h2 className="text-xl font-semibold">{card.name}</h2>
        </EditableText>
        <div className="flex flex-col space-y-6 px-2">
          <Suspense fallback={null}>
            <ListSelector card={card} />
          </Suspense>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold">Description</h3>
              <button className="text-secondary text-sm" type="button">
                Edit
              </button>
            </div>
            <p className="text-sm">{card.description}</p>
          </div>
        </div>
        <button
          className="close-popover absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300"
          type="button"
          onMouseUp={() => closeCard()}>
          <span className="pointer-events-none">
            <CloseIcon height={24} />
          </span>
        </button>
      </div>
    </div>
  );
}
