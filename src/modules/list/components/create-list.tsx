'use client';

import { useRef, useState } from 'react';
import CloseIcon from '@/modules/common/components/icons/close';
import invariant from 'tiny-invariant';
import PlusIcon from '@/modules/common/components/icons/plus';
import { useClickAway } from '@uidotdev/usehooks';
import { generateRank, resizeTextarea } from '@/modules/common/utils/utils';
import { listKeys, useLists } from '@/modules/list/lib/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList } from '@/modules/list/lib/actions';
import { TList } from '@/modules/common/types/db';

export function CreateList({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  const { data: lists } = useLists(boardId);
  const [isCreatingList, setIsCreatingList] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    setIsCreatingList(false);
  });

  const { queryKey } = listKeys.list(boardId);
  const { mutate: addList } = useMutation({
    mutationFn: ({ name, rank }: { name: string; rank: string }) =>
      createList({ boardId, name, rank }),
    onMutate: async ({ name, rank }: { name: string; rank: string }) => {
      await queryClient.cancelQueries({ queryKey });

      const optimisticList: TList = {
        id: crypto.randomUUID(),
        name,
        rank,
        boardId,
        createdAt: '',
        updatedAt: '',
        workspaceId: '',
      };

      queryClient.setQueryData(queryKey, (old: TList[]) => [...old, optimisticList]);

      return { optimisticList };
    },
    onSuccess: async ({ data }, _variables, context) => {
      invariant(data);
      queryClient.setQueryData(queryKey, (old: TList[]) =>
        old.map(list => (list.id === context.optimisticList.id ? { ...list, ...data } : list)),
      );
    },
    onError: (_error, _variables, context) => {
      invariant(context);
      queryClient.setQueryData(queryKey, (old: TList[]) =>
        old.filter(list => list.id !== context.optimisticList.id),
      );

      alert('An error occurred while creating the element');
    },
  });

  const handleListCreated = () => {
    const textarea = textareaRef.current;
    invariant(textarea);
    const name = textarea.value.trim();

    if (!name) {
      return;
    }

    const rank = generateRank(lists, lists.length - 1);
    addList({ name, rank: rank.format() });
    textarea.value = '';
    textarea.focus();
  };

  return (
    <>
      {!isCreatingList ? (
        <li>
          <button
            className="mx-1.5 flex w-[272px] cursor-pointer items-center gap-2 rounded-xl bg-white/10 p-3 text-sm text-white shadow hover:bg-white/15"
            type="button"
            onClick={() => setIsCreatingList(true)}>
            <PlusIcon width={16} height={16} />
            {lists.length ? 'Add another list' : 'Add a list'}
          </button>
        </li>
      ) : (
        <div
          className="text-primary mx-1.5 flex h-max w-[272px] shrink-0 cursor-pointer flex-col gap-2 rounded-xl bg-gray-200 p-2 text-sm"
          ref={clickAwayRef}>
          <textarea
            className="shadow-transition focus:shadow-transition-effect resize-none overflow-hidden rounded-md bg-white px-2.5 py-1.5 font-semibold outline-hidden"
            onChange={() => resizeTextarea(textareaRef)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleListCreated();
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsCreatingList(false);
              }
            }}
            ref={textareaRef}
            autoFocus
            rows={1}
          />
          <div className="flex gap-2">
            <button
              className="bg-secondary cursor-pointer rounded px-3 py-1.5 text-sm font-medium text-white hover:opacity-80 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              type="button"
              onClick={handleListCreated}>
              Add list
            </button>
            <button
              className="h-full cursor-pointer rounded-sm p-1.5 hover:bg-gray-300"
              type="button"
              onClick={() => {
                setIsCreatingList(false);
              }}>
              <span className="pointer-events-none">
                <CloseIcon height={20} />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
