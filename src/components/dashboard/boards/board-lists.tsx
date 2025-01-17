'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { isCardData, isListData } from '@/types/drag-types';
import { TList, TSubsetWithId } from '@/types/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List } from '@/components/dashboard/boards/list';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import PlusIcon from '@/components/icons/plus';
import { generateRank } from '@/lib/utils/utils';
import { BoardContext, BoardContextValue } from './board-context';

type TListDrag = {
  type: 'list';
  initialIndex: number;
};

type TCardDrag = {
  type: 'card';
  initialIndex: number;
};

type TCurrentDrag = TListDrag | TCardDrag;

type TBoardListsState = {
  lists: TList[];
  currentDrag: TCurrentDrag | null;
};

export default function BoardLists({ initialLists }: { initialLists: TList[] }) {
  const [boardListsData, setBoardListsdata] = useState<TBoardListsState>({
    lists: initialLists,
    currentDrag: null,
  });
  const scrollableRef = useRef<HTMLUListElement | null>(null);

  const {
    optimisticList: optimisticBoardLists,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(boardListsData.lists, {
    updateAction: entityData => updateEntityAction('board_list', entityData),
    deleteAction: entityId => deleteEntityAction('board_list', entityId),
  });

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isListData(source.data),
        onDrop: async ({ source, location }) => {
          const { lists, currentDrag } = boardListsData;
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;

          if (!currentDrag || !isListData(dragging)) {
            return;
          }

          const currentIndex = lists.findIndex(list => list.id === dragging.id);

          if (!isListData(dropTarget)) {
            // Drag operation was cancelled, revert the order
            setBoardListsdata({
              lists: reorder({
                list: lists,
                startIndex: currentIndex,
                finishIndex: currentDrag.initialIndex,
              }),
              currentDrag: null,
            });
            return;
          }

          try {
            const rank = generateRank(lists, currentIndex).format();
            await updateEntityAction('board_list', { id: dragging.id, rank });
            const updatedLists = lists.with(currentIndex, {
              ...lists[currentIndex],
              rank,
            });

            setBoardListsdata({
              lists: updatedLists,
              currentDrag: null,
            });
          } catch (error) {
            // Revert the order
            setBoardListsdata({
              lists: reorder({
                list: lists,
                startIndex: currentIndex,
                finishIndex: currentDrag.initialIndex,
              }),
              currentDrag: null,
            });
            alert('An error occurred while updating the element');
          }
        },

        onDrag: ({ source, location }) => {
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;
          if (!isListData(dragging) || !isListData(dropTarget)) {
            return;
          }

          const startIndex = boardListsData.lists.findIndex(list => list.id === dragging.id);
          const indexOfTarget = boardListsData.lists.findIndex(list => list.id === dropTarget.id);
          const closestEdgeOfTarget = extractClosestEdge(dropTarget);
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: 'horizontal',
          });

          if (startIndex === destinationIndex) {
            return;
          }

          setBoardListsdata(prev => {
            const { lists } = prev;
            const list = lists[startIndex];
            const currentDrag = prev.currentDrag ?? {
              type: 'list',
              initialIndex: startIndex,
              list,
            };

            return {
              lists: reorder({
                list: lists,
                startIndex,
                finishIndex: destinationIndex,
              }),
              currentDrag,
            };
          });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          return isListData(source.data) || isCardData(source.data);
        },
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element,
      }),
    );
  }, [boardListsData]);

  const updateList = useCallback((listData: TSubsetWithId<TList>) => {}, []);
  const deleteList = useCallback(() => {}, []);
  const updateCard = useCallback(() => {}, []);
  const deleteCard = useCallback(() => {}, []);

  const contextValue: BoardContextValue = useMemo(
    () => ({
      updateList,
      deleteList,
      updateCard,
      deleteCard,
    }),
    [updateList, deleteList, updateCard, deleteCard],
  );

  const [counter, setCounter] = useState(0);

  return (
    <BoardContext.Provider value={contextValue}>
      <button
        type="button"
        onClick={() => {
          setCounter(prev => prev + 1);
        }}>
        set counter
      </button>
      <div>{counter}</div>
      <ul
        className="scrollbar-transparent flex h-full gap-4 overflow-x-auto p-4"
        ref={scrollableRef}>
        {optimisticBoardLists.map(list => (
          <li className="flex" key={list.id}>
            <List list={list} />
          </li>
        ))}
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
            {optimisticBoardLists.length ? 'Add another list' : 'Add a list'}
          </button>
        </li>
      </ul>
    </BoardContext.Provider>
  );
}
