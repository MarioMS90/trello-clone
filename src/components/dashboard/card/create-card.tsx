'use client';

import { useRef } from 'react';
import CloseIcon from '@/components/icons/close';
import invariant from 'tiny-invariant';
import { generateRank, resizeTextarea } from '@/lib/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCard } from '@/lib/card/actions';
import { useClickAway } from '@uidotdev/usehooks';
import { cardKeys, useCards } from '@/lib/card/queries';
import { useBoardId } from '@/hooks/useBoardId';
import { TCardWithComments } from '@/types/db';

export function CreateCard({ listId, onCancel }: { listId: string; onCancel: () => void }) {
  const queryClient = useQueryClient();
  const boardId = useBoardId();
  const { data: cards } = useCards(listId);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickAwayRef = useClickAway<HTMLLIElement>(() => {
    onCancel();
  });

  const { queryKey } = cardKeys.list(boardId);
  const { mutate: addCard } = useMutation({
    mutationFn: ({ name, rank }: { name: string; rank: string }) =>
      createCard({ listId, name, rank }),
    onMutate: async ({ name, rank }: { name: string; rank: string }) => {
      await queryClient.cancelQueries({ queryKey });

      const optimisticCard: TCardWithComments = {
        id: crypto.randomUUID(),
        name,
        rank,
        listId,
        commentCount: 0,
        description: '',
        createdAt: '',
        updatedAt: '',
        workspaceId: '',
      };

      queryClient.setQueryData(queryKey, (old: TCardWithComments[]) => [...old, optimisticCard]);

      return { optimisticCard };
    },
    onSuccess: ({ data }, _variables, context) => {
      invariant(data);
      queryClient.setQueryData(queryKey, (old: TCardWithComments[]) =>
        old.map(card => (card.id === context.optimisticCard.id ? { ...card, ...data } : card)),
      );
    },
    onError: (_error, _variables, context) => {
      invariant(context);
      queryClient.setQueryData(queryKey, (old: TCardWithComments[]) =>
        old.filter(card => card.id !== context.optimisticCard.id),
      );

      alert('An error occurred while creating the element');
    },
  });

  const createNewCard = () => {
    const textarea = textareaRef.current;
    invariant(textarea);
    const name = textarea.value.trim();

    if (!name) {
      onCancel();
      return;
    }

    const rank = generateRank(cards, cards.length - 1);
    addCard({ name, rank: rank.format() });
    textarea.value = '';
    textarea.focus();
  };

  return (
    <li className="text-primary flex shrink-0 flex-col gap-2 px-2 pt-1 text-sm" ref={clickAwayRef}>
      <textarea
        className="card-shadow focus:shadow-transition focus:shadow-transition-effect min-h-14 resize-none overflow-hidden rounded-lg bg-white p-3 py-2 placeholder-gray-500 outline-hidden"
        placeholder="Enter a title for this card"
        onChange={() => resizeTextarea(textareaRef)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            createNewCard();
          }
        }}
        onKeyUp={e => {
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        ref={textareaRef}
        autoFocus
        rows={1}
      />
      <div className="mt-1 flex gap-2">
        <button
          className="bg-secondary cursor-pointer rounded px-3 py-1.5 text-sm font-medium text-white hover:opacity-80 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          type="button"
          onClick={createNewCard}>
          Add card
        </button>
        <button
          className="h-full cursor-pointer rounded-sm p-1.5 hover:bg-gray-300"
          type="button"
          onClick={onCancel}>
          <span className="pointer-events-none">
            <CloseIcon height={20} />
          </span>
        </button>
      </div>
    </li>
  );
}
