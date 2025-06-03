'use client';

import { useState } from 'react';
import CloseIcon from '@/components/icons/close';
import EditableText from '@/components/ui/editable-text';
import { useCard } from '@/lib/card/queries';
import { useClickAway } from '@uidotdev/usehooks';
import { notFound, useRouter } from 'next/navigation';
import { useBoardId } from '@/hooks/useBoardId';
import { useCardMutation } from '@/hooks/useCardMutation';
import DescriptionIcon from '@/components/icons/description';
import CardIcon from '@/components/icons/card';
import { cn } from '@/lib/utils/utils';

export default function Card({ cardId }: { cardId: string }) {
  const boardId = useBoardId();
  const router = useRouter();
  const { data: cardData } = useCard(cardId);
  const { modifyCard } = useCardMutation();
  const [isEditingDescription, setIsEditingDescription] = useState(true);

  if (!cardData) {
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

  const card =
    modifyCard.isPending && modifyCard.variables
      ? { ...cardData, ...modifyCard.variables }
      : cardData;

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
                  defaultText={card.name}
                  onEdit={text => modifyCard.mutate({ id: card.id, name: text })}
                  editOnClick
                  autoResize>
                  <h2 className="text-xl font-semibold">{card.name}</h2>
                </EditableText>

                <span className="px-2 text-sm">in list {card.listName}</span>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="flex gap-1.5">
              <span className="py-1">
                <DescriptionIcon width={24} height={24} />
              </span>
              <div className="flex grow flex-col gap-2">
                <div className="flex items-center justify-between pl-1.5">
                  <h3 className="text-md font-semibold">Description</h3>
                  <button
                    className={cn(
                      'text-primary cursor-pointer rounded-sm bg-neutral-300 px-3 py-1.5 text-sm font-medium hover:opacity-80',
                      {
                        invisible: isEditingDescription,
                      },
                    )}
                    type="button"
                    onClick={() => {
                      setIsEditingDescription(true);
                    }}>
                    {card.description ? 'Edit' : 'Add description'}
                  </button>
                </div>
                <EditableText
                  className="mr-[74px] [&>textarea]:text-sm"
                  defaultText={card.description}
                  onEdit={text => modifyCard.mutate({ id: card.id, description: text })}
                  autoResize
                  autoSelect={false}
                  blurOnEnter={false}
                  editing={isEditingDescription}
                  onEditingChange={setIsEditingDescription}>
                  <p className="text-sm whitespace-pre-wrap">{card.description}</p>
                </EditableText>
                {isEditingDescription && (
                  <button
                    className="bg-secondary cursor-pointer self-start rounded-sm px-3 py-1.5 text-sm font-medium text-white hover:opacity-80"
                    type="button"
                    onClick={() => {
                      setIsEditingDescription(false);
                    }}>
                    Save
                  </button>
                )}
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
