'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { bind, bindAll } from 'bind-event-listener';
import { isCardData, isListData } from '@/types/drag-types';
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
import { generateElementRank, updateListObj } from '@/lib/utils/utils';
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

  const moveCard = useCallback(
    ({
      cardId,
      destinationIndex,
      sourceListId,
      destinationListId,
    }: {
      cardId: string;
      destinationIndex?: number;
      sourceListId: string;
      destinationListId: string;
    }) => {
      const sourceListIndex = lists.findIndex(list => list.id === sourceListId);
      const destinationListIndex = lists.findIndex(list => list.id === destinationListId);
      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];
      const draggingCardIndex = sourceList.cards.findIndex(card => card.id === cardId);

      const filteredLists = lists.with(sourceListIndex, {
        ...sourceList,
        cards: sourceList.cards.filter(card => card.id !== cardId),
      });

      return filteredLists.with(destinationListIndex, {
        ...destinationList,
        cards: [
          ...destinationList.cards.slice(0, destinationIndex),
          {
            ...destinationList.cards[draggingCardIndex],
            board_list_id: destinationList.id,
          },
          ...destinationList.cards.slice(destinationIndex),
        ],
      });
    },
    [lists],
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

          const startIndex = lists.findIndex(list => list.id === dragging.id);
          const indexOfTarget = lists.findIndex(list => list.id === dropTarget.id);
          const closestEdgeOfTarget = extractClosestEdge(dropTarget);
          const finishIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: 'horizontal',
          });

          if (startIndex === finishIndex) {
            return;
          }

          const reordered = reorder({
            list: lists,
            startIndex,
            finishIndex,
          });

          const rank = generateElementRank({
            list: reordered,
            elementIndex: finishIndex,
          }).format();

          const updated = reordered.with(finishIndex, {
            ...reordered[finishIndex],
            rank,
          });
          setLists(updated);

          try {
            await updateEntityAction({
              tableName: 'board_list',
              entityData: { id: dragging.id, rank },
            });
          } catch (error) {
            alert('An error occurred while updating the element');
          }
        },
      }),
      monitorForElements({
        canMonitor: ({ source }) => isCardData(source.data),
        onDrop: async ({ source, location }) => {
          const dragging = source.data;

          if (!isCardData(dragging)) {
            return;
          }

          if (location.current.dropTargets.length === 1) {
            // Targeting to another list whitout specifying card target
            const listTarget = location.current.dropTargets[0]?.data;

            if (!isListData(listTarget)) {
              return;
            }

            const updated = moveCard({
              cardId: dragging.id,
              sourceListId: dragging.listId,
              destinationListId: listTarget.id,
            });

            const listIndex = updated.findIndex(list => list.id === listTarget.id);
            const cardIndex = updated[listIndex].cards.findIndex(card => card.id === dragging.id);
            const list = updated[listIndex];

            const rank = generateElementRank({
              list: list.cards,
              elementIndex: cardIndex,
            }).format();

            const updatedList = {
              ...list,
              cards: list.cards.with(cardIndex, {
                ...list.cards[cardIndex],
                rank,
              }),
            };

            setLists(updated.with(listIndex, updatedList));

            try {
              await updateEntityAction({
                tableName: 'card',
                entityData: {
                  ...list.cards[cardIndex],
                  rank,
                },
              });
            } catch (error) {
              alert('An error occurred while updating the element');
            }
          }

          if (location.current.dropTargets.length === 2) {
            // Targeting to a list and a card
            const cardTarget = location.current.dropTargets[0]?.data;
            const listTarget = location.current.dropTargets[1]?.data;

            if (!isCardData(cardTarget) || !isListData(listTarget)) {
              return;
            }

            console.log('todo ok');

            // const { id: listId } = dropTarget;
            // const list = lists.find(_list => _list.id === listId);
            // if (!list) {
            //   return;
            // }
            // const startIndex = list.cards.findIndex(card => card.id === dragging.id);
            // const indexOfTarget = list.cards.findIndex(card => card.id === dropTarget.id);
            // const closestEdgeOfTarget = extractClosestEdge(dropTarget);
            // const finishIndex = getReorderDestinationIndex({
            //   startIndex,
            //   indexOfTarget,
            //   closestEdgeOfTarget,
            //   axis: 'vertical',
            // });
            // console.log('finishIndex', finishIndex);
          }
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
  }, [lists, moveCard]);

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
          const rank = generateLastRank({ list: lists }).format();
          const list = await createListAction({ boardId, name, rank });
          startTransition(async () => setLists(current => [...current, list]));
        } catch (error) {
          alert('An error occurred while creating the element');
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
