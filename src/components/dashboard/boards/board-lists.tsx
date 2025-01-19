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
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import { List } from '@/components/dashboard/boards/list';
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

type TListsState = {
  lists: TList[];
  currentDrag: TCurrentDrag | null;
};

export default function BoardLists({ initialLists }: { initialLists: TList[] }) {
  const [listsData, setListsdata] = useState<TListsState>({
    lists: initialLists,
    currentDrag: null,
  });
  const scrollableRef = useRef<HTMLUListElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticLists, setOptimisticLists] = useOptimistic<
    TList[],
    (currentLists: TList[]) => TList[]
  >(listsData.lists, (currentLists, callback) => callback(currentLists));

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isListData(source.data),
        onDrop: async ({ source, location }) => {
          const { lists, currentDrag } = listsData;
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;

          if (!currentDrag || !isListData(dragging)) {
            return;
          }

          const currentIndex = lists.findIndex(list => list.id === dragging.id);

          if (!isListData(dropTarget)) {
            // Drag operation was cancelled, revert the order
            setListsdata({
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

            setListsdata({
              lists: updatedLists,
              currentDrag: null,
            });
          } catch (error) {
            // Revert the order
            setListsdata({
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

          const startIndex = listsData.lists.findIndex(list => list.id === dragging.id);
          const indexOfTarget = listsData.lists.findIndex(list => list.id === dropTarget.id);
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

          setListsdata(current => {
            const { lists } = current;
            const list = lists[startIndex];
            const currentDrag = current.currentDrag ?? {
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
  }, [listsData]);

  const listsUpdater = useCallback((listData: TSubsetWithId<TList>) => {
    setListsdata(current => ({
      ...current,
      lists: current.lists.map(list => (list.id === listData.id ? { ...list, ...listData } : list)),
    }));
  }, []);

  const updateList = useCallback(
    (listData: TSubsetWithId<TList>) => {
      startTransition(async () => {
        setOptimisticLists(current =>
          current.map(list => (list.id === listData.id ? { ...list, ...listData } : list)),
        );

        try {
          await updateEntityAction('board_list', listData);
          listsUpdater(listData);
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while updating the element');
        }
      });
    },
    [startTransition, setOptimisticLists, listsUpdater],
  );

  const deleteList = useCallback(
    async (id: string) => {
      startTransition(async () => {
        setOptimisticLists(current => current.filter(list => list.id !== id));

        try {
          await deleteEntityAction('board_list', id);
          setListsdata(current => ({
            ...current,
            lists: current.lists.filter(list => list.id !== id),
          }));
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while deleting the element');
        }
      });
    },
    [startTransition, setOptimisticLists],
  );

  const updateCard = useCallback(async (cardData: TSubsetWithId<TList>) => {}, []);

  const deleteCard = useCallback(async (listData: TSubsetWithId<TList>) => {}, []);

  const contextValue: BoardContextValue = useMemo(
    () => ({
      updateList,
      deleteList,
      updateCard,
      deleteCard,
    }),
    [updateList, deleteList, updateCard, deleteCard],
  );

  return (
    <BoardContext.Provider value={contextValue}>
      <ul
        className="scrollbar-transparent flex h-full gap-4 overflow-x-auto p-4"
        ref={scrollableRef}>
        {optimisticLists.map(list => (
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
            {optimisticLists.length ? 'Add another list' : 'Add a list'}
          </button>
        </li>
      </ul>
    </BoardContext.Provider>
  );
}
