'use client';

import CloseIcon from '@/components/icons/close';
import EditableText from '@/components/ui/editable-text';
import { useCard } from '@/lib/card/queries';
import { useClickAway } from '@uidotdev/usehooks';
import { notFound, useRouter } from 'next/navigation';
import { useBoardId } from '@/hooks/useBoardId';
import { useCardMutation } from '@/hooks/useCardMutation';
import DescriptionIcon from '@/components/icons/description';
import CommentIcon from '@/components/icons/comment';
import CardIcon from '@/components/icons/card';

export default function Card({ cardId }: { cardId: string }) {
  const boardId = useBoardId();
  const router = useRouter();
  const { data: card } = useCard(cardId);

  const { modifyCard } = useCardMutation();

  if (!card) {
    notFound();
  }

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
    router.push(`/boards/${boardId}`);
  };

  const cardName =
    modifyCard.isPending && modifyCard.variables.name ? modifyCard.variables.name : card.name;

  return (
    <div className="scrollbar-stable text-primary fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/75">
      <div
        className="center-x fixed top-12 flex w-auto flex-col rounded-xl bg-neutral-200 px-3 py-4 md:w-[768px]"
        ref={clickAwayRef}>
        <div className="flex flex-col space-y-6">
          <div className="px-2">
            <div className="flex gap-1">
              <span className="flex h-10 items-center">
                <CardIcon width={24} height={24} />
              </span>
              <div className="flex grow flex-col">
                <EditableText
                  className="mr-[74px] [&>textarea]:text-xl [&>textarea]:font-semibold"
                  defaultText={cardName}
                  onEdit={text => modifyCard.mutate({ id: card.id, name: text })}
                  editOnClick
                  autoResize>
                  <h2 className="text-xl font-semibold">{cardName}</h2>
                </EditableText>

                <span className="px-2 text-sm">in list {card.listName}</span>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="flex gap-3">
              <DescriptionIcon width={24} height={24} />
              <div className="flex grow flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">Description</h3>

                  <button className="text-secondary text-sm" type="button">
                    Edit
                  </button>
                </div>
                <p className="text-sm">{card.description}</p>
              </div>
            </div>
          </div>
          <div className="px-2">
            <div className="flex gap-3">
              <CommentIcon width={24} height={24} />
              <div className="flex grow flex-col gap-2">
                <h3 className="text-md font-semibold">Comments</h3>

                <div>Comments here</div>
              </div>
            </div>
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
