'use client';

import { useRef, useState } from 'react';
import CloseIcon from '@/components/icons/close';
import invariant from 'tiny-invariant';
import PlusIcon from '@/components/icons/plus';
import { useClickAway } from '@uidotdev/usehooks';
import { generateRank, resizeTextarea } from '@/lib/utils/utils';
import { listKeys, useLists } from '@/lib/list/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList } from '@/lib/list/actions';
import { TList } from '@/types/db';

export function CreateList({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  invariant(boardId);
  const { data: lists } = useLists(boardId);
  const [isCreatingList, setIsCreatingList] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    setIsCreatingList(false);
  });

  const { queryKey } = listKeys.list(boardId);
  const { mutate: addList } = useMutation({
    mutationFn: async ({ name, rank }: { name: string; rank: string }) =>
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
        old.map(list => (list.id === context.optimisticList.id ? data : list)),
      );
    },
    onError: (_error, _variables, context) => {
      invariant(context);
      queryClient.setQueryData(queryKey, (old: TList[]) =>
        old.filter(list => list.id !== context.optimisticList.id),
      );

      alert('An error occurred while deleting the element');
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
    addList({ name, rank: rank.toString() });
    textarea.value = '';
    textarea.focus();
  };

  return (
    <>
      {!isCreatingList ? (
        <li>
          <button
            type="button"
            className="
            mx-1.5 
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
          "
            onClick={() => setIsCreatingList(true)}>
            <PlusIcon width={16} height={16} />
            {lists.length ? 'Add another list' : 'Add a list'}
          </button>
        </li>
      ) : (
        <div
          className="mx-1.5 flex h-max w-[272px] flex-shrink-0 flex-col gap-2 rounded-xl bg-gray-200 p-2 text-sm text-primary"
          ref={clickAwayRef}>
          <textarea
            className="shadow-transition focus:shadow-transition-effect resize-none overflow-hidden rounded-md bg-white px-2.5 py-1.5 font-semibold outline-none"
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
              className="
                rounded 
                bg-secondary 
                px-3 
                py-1.5 
                text-sm 
                font-medium 
                text-white 
                hover:opacity-80
                disabled:cursor-not-allowed 
                disabled:bg-gray-200 
                disabled:text-gray-400
              "
              type="button"
              onClick={handleListCreated}>
              Add list
            </button>
            <button
              className="h-full rounded p-1.5 hover:bg-gray-300"
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
