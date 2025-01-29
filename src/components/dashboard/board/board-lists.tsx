'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { bind, bindAll } from 'bind-event-listener';
import { isCardData, isListData, TCardData, TListData } from '@/types/drag-types';
import { TCard, TList, TSubsetWithId } from '@/types/types';
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import { List } from '@/components/dashboard/list/list';
import { createListAction, deleteEntityAction, updateEntityAction } from '@/lib/actions';
import { generateRank, updateListObj } from '@/lib/utils/utils';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { blockBoardPanningAttr } from '@/constants/constants';
import { BoardContext, BoardContextValue } from './board-context';
import { CreateList } from '../list/create-list';

export default function BoardLists({
  boardId,
  initialLists,
}: {
  boardId: string;
  initialLists: TList[];
}) {
  const [lists, setLists] = useState<TList[]>(initialLists);
  const scrollableRef = useRef<HTMLUListElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticLists, setOptimisticLists] = useOptimistic<
    TList[],
    (currentLists: TList[]) => TList[]
  >(lists, (currentLists, callback) => callback(currentLists));

  const reorderElement = useCallback(
    <T extends { id: string; rank: string }>({
      list,
      startIndex,
      finishIndex,
    }: {
      list: T[];
      startIndex: number;
      finishIndex: number;
    }) => {
      if (startIndex === finishIndex) {
        return list;
      }

      const rank = generateRank({
        list,
        leftIndex: startIndex < finishIndex ? finishIndex : finishIndex - 1,
      }).format();

      const updated = list.with(startIndex, {
        ...list[startIndex],
        rank,
      });

      const reordered = reorder({
        list: updated,
        startIndex,
        finishIndex,
      });

      return reordered;
    },
    [],
  );

  const getReorderIndices = useCallback(
    <T extends { id: string }>({
      list,
      destinationList,
      dragging,
      dropTarget,
      axis,
    }: {
      list: T[];
      destinationList?: T[];
      dragging: TListData | TCardData;
      dropTarget: TListData | TCardData | null;
      axis: 'horizontal' | 'vertical';
    }) => {
      const startIndex = list.findIndex(element => element.id === dragging.id);
      const targetList = destinationList ?? list;

      if (!dropTarget) {
        return { startIndex, finishIndex: targetList.length - 1 };
      }

      const indexOfTarget = targetList.findIndex(element => element.id === dropTarget.id);
      const closestEdgeOfTarget = extractClosestEdge(dropTarget);
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
        axis,
      });

      return { startIndex, finishIndex };
    },
    [],
  );

  const moveCard = useCallback(
    ({
      cardId,
      destinationIndex,
      sourceListIndex,
      destinationListIndex,
    }: {
      cardId: string;
      destinationIndex: number;
      sourceListIndex: number;
      destinationListIndex: number;
    }) => {
      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];
      const draggingCard = sourceList.cards.find(card => card.id === cardId);

      if (!draggingCard) {
        return lists;
      }

      const filtered = lists.with(sourceListIndex, {
        ...sourceList,
        cards: sourceList.cards.filter(card => card.id !== cardId),
      });

      const rank = generateRank({
        list: destinationList.cards,
        leftIndex: destinationIndex - 1,
      }).format();

      const updated = filtered.with(destinationListIndex, {
        ...destinationList,
        cards: destinationList.cards.toSpliced(destinationIndex, 0, {
          ...draggingCard,
          board_list_id: destinationList.id,
          rank,
        }),
      });

      return updated;
    },
    [lists],
  );

  const reorderCard = useCallback(
    ({
      dragging,
      listTarget,
      cardTarget,
    }: {
      dragging: TCardData;
      listTarget: TListData;
      cardTarget: TCardData | null;
    }) => {
      const sourceListIndex = lists.findIndex(list => list.id === dragging.listId);
      const destinationListIndex = lists.findIndex(list => list.id === listTarget.id);
      const sourceList = lists[sourceListIndex];

      const destinationList = lists[destinationListIndex];
      console.log('destinationList.cards', destinationList.cards);
      console.log('cardTarget', cardTarget);
      const { startIndex, finishIndex } = getReorderIndices({
        list: sourceList.cards,
        destinationList: destinationList.cards,
        dragging,
        dropTarget: cardTarget,
        axis: 'vertical',
      });

      if (sourceListIndex === destinationListIndex && startIndex === finishIndex) {
        return undefined;
      }

      if (sourceListIndex !== destinationListIndex) {
        console.log('hola', {
          cardId: dragging.id,
          destinationIndex: finishIndex,
          sourceListIndex,
          destinationListIndex,
        });

        return moveCard({
          cardId: dragging.id,
          destinationIndex: finishIndex,
          sourceListIndex,
          destinationListIndex,
        });
      }

      const reordered = reorderElement({
        list: sourceList.cards,
        startIndex,
        finishIndex,
      });

      const updated = lists.with(sourceListIndex, {
        ...sourceList,
        cards: reordered,
      });

      return updated;
    },
    [lists, getReorderIndices, moveCard, reorderElement],
  );

  useEffect(() => {
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isListData(source.data),
        onDrop: async ({ source, location }) => {
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;

          if (!isListData(dragging) || !isListData(dropTarget)) {
            return;
          }

          const { startIndex, finishIndex } = getReorderIndices({
            list: lists,
            dragging,
            dropTarget,
            axis: 'horizontal',
          });

          if (startIndex === finishIndex) {
            return;
          }

          const updatedLists = reorderElement({
            list: lists,
            startIndex,
            finishIndex,
          });

          startTransition(async () => {
            setOptimisticLists(() => updatedLists);

            try {
              const { rank } = updatedLists[finishIndex];

              await updateEntityAction({
                tableName: 'board_list',
                entityData: { id: dragging.id, rank },
              });
              startTransition(async () => setLists(updatedLists));
            } catch (error) {
              alert('An error occurred while updating the element');
            }
          });
        },
      }),
      monitorForElements({
        canMonitor: ({ source }) => isCardData(source.data),
        onDrop: async ({ source, location }) => {
          const dragging = source.data;
          const firstDropTarget = location.current.dropTargets[0]?.data;
          const secondDropTarget = location.current.dropTargets[1]?.data;
          const listTarget = isListData(firstDropTarget) ? firstDropTarget : secondDropTarget;
          const cardTarget = isCardData(firstDropTarget) ? firstDropTarget : null;

          if (!isCardData(dragging) || !isListData(listTarget)) {
            return;
          }

          const updatedLists = reorderCard({
            dragging,
            listTarget,
            cardTarget,
          });

          if (!updatedLists) {
            return;
          }

          startTransition(async () => {
            setOptimisticLists(() => updatedLists);

            try {
              const destinationListIndex = updatedLists.findIndex(list =>
                list.cards.some(card => card.id === dragging.id),
              );
              const list = updatedLists[destinationListIndex];
              const cardIndex = list.cards.findIndex(card => card.id === dragging.id);

              await updateEntityAction({
                tableName: 'card',
                entityData: list.cards[cardIndex],
              });
              startTransition(async () => setLists(updatedLists));
            } catch (error) {
              alert('An error occurred while updating the element');
            }
          });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          return isListData(source.data) || isCardData(source.data);
        },
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element: scrollable,
      }),
    );
  }, [lists, getReorderIndices, reorderElement, reorderCard, setOptimisticLists]);

  // Panning the board
  useEffect(() => {
    let cleanupActive: CleanupFn | null = null;
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;

      const cleanupEvents = bindAll(
        window,
        [
          {
            type: 'pointermove',
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;

              lastX = currentX;
              scrollable?.scrollBy({ left: diffX });
            },
          },
          // stop panning if we see any of these events
          ...(
            [
              'pointercancel',
              'pointerup',
              'pointerdown',
              'keydown',
              'resize',
              'click',
              'visibilitychange',
            ] as const
          ).map(eventName => ({
            type: eventName,
            listener: () => {
              cleanupEvents();
            },
          })),
        ],
        // need to make sure we are not after the "pointerdown" on the scrollable
        // Also this is helpful to make sure we always hear about events from this point
        { capture: true },
      );

      cleanupActive = cleanupEvents;
    }

    const cleanupStart = bind(scrollable, {
      type: 'pointerdown',
      listener(event) {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }
        // ignore interactive elements
        if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
          return;
        }

        // Prevent text selected dragging
        window?.getSelection()?.removeAllRanges();

        begin({ startX: event.clientX });
      },
    });

    return function cleanupAll() {
      cleanupStart();
      cleanupActive?.();
    };
  }, []);

  const addList = useCallback(
    (name: string) => {
      const temporalId = crypto.randomUUID();
      startTransition(async () => {
        setOptimisticLists(current => [
          ...current,
          { id: temporalId, name, cards: [] } as unknown as TList,
        ]);

        try {
          const rank = generateRank({ list: lists, leftIndex: lists.length - 1 }).format();
          const list = await createListAction({ boardId, name, rank });
          startTransition(async () => setLists(current => [...current, list]));
        } catch (error) {
          alert(error);
        }
      });
    },
    [lists, setOptimisticLists, boardId],
  );

  const updateList = useCallback(
    (listData: TSubsetWithId<TList>) => {
      startTransition(async () => {
        setOptimisticLists(current => updateListObj(current, listData));

        try {
          await updateEntityAction({
            tableName: 'board_list',
            entityData: listData,
          });
          startTransition(async () => setLists(current => updateListObj(current, listData)));
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while updating the element');
        }
      });
    },
    [startTransition, setOptimisticLists],
  );

  const deleteList = useCallback(
    (id: string) => {
      startTransition(async () => {
        setOptimisticLists(current => current.filter(list => list.id !== id));

        try {
          await deleteEntityAction({
            tableName: 'board_list',
            entityId: id,
          });
          startTransition(async () => setLists(current => current.filter(list => list.id !== id)));
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while deleting the element');
        }
      });
    },
    [startTransition, setOptimisticLists],
  );

  const addCard = useCallback((listId: string, cardName: string) => {}, []);

  const updateCard = useCallback((cardData: TSubsetWithId<TCard>) => {}, []);

  const deleteCard = useCallback((id: string) => {}, []);

  const contextValue: BoardContextValue = useMemo(
    () => ({
      addList,
      updateList,
      deleteList,
      addCard,
      updateCard,
      deleteCard,
    }),
    [addList, updateList, deleteList, addCard, updateCard, deleteCard],
  );

  return (
    <BoardContext.Provider value={contextValue}>
      <ul
        className="scrollbar-transparent [-webkit-user-drag: none] flex h-full select-none overflow-x-auto p-4"
        ref={scrollableRef}
        draggable={false}>
        {optimisticLists.map(list => (
          <List list={list} key={list.id} />
        ))}
        <CreateList buttonText={optimisticLists.length ? 'Add another list' : 'Add a list'} />
      </ul>
    </BoardContext.Provider>
  );
}
