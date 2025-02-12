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
import { createList, createCard, deleteEntity, updateEntity } from '@/lib/actions';
import { generateRank, updateElement } from '@/lib/utils/utils';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { blockBoardPanningAttr } from '@/constants/constants';
import { BoardContext, BoardContextValue } from '../board/board-context';
import { CreateList } from './create-list';

export default function Lists({
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
      elements,
      startIndex,
      finishIndex,
    }: {
      elements: T[];
      startIndex: number;
      finishIndex: number;
    }) => {
      if (startIndex === finishIndex) {
        return elements;
      }

      const rank = generateRank({
        elements,
        leftIndex: startIndex < finishIndex ? finishIndex : finishIndex - 1,
      }).format();

      const updated = elements.with(startIndex, {
        ...elements[startIndex],
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

  const getPositionIndices = useCallback(
    <T extends { id: string }>({
      sourceElements,
      destinationElements,
      dragging,
      dropTarget,
      axis,
      isReorder = false,
    }: {
      sourceElements: T[];
      destinationElements: T[];
      dragging: TListData | TCardData;
      dropTarget: TListData | TCardData | null;
      axis: 'horizontal' | 'vertical';
      isReorder?: boolean;
    }) => {
      const startIndex = sourceElements.findIndex(element => element.id === dragging.id);

      if (!dropTarget) {
        return {
          startIndex,
          finishIndex: !isReorder ? destinationElements.length : destinationElements.length - 1,
        };
      }

      const indexOfTarget = destinationElements.findIndex(element => element.id === dropTarget.id);
      const closestEdgeOfTarget = extractClosestEdge(dropTarget);

      if (isReorder) {
        const finishIndex = getReorderDestinationIndex({
          startIndex,
          indexOfTarget,
          closestEdgeOfTarget,
          axis,
        });

        return { startIndex, finishIndex };
      }

      return {
        startIndex,
        finishIndex: closestEdgeOfTarget === 'top' ? indexOfTarget : indexOfTarget + 1,
      };
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
        return undefined;
      }

      const rank = generateRank({
        elements: destinationList.cards,
        leftIndex: destinationIndex - 1,
      }).format();

      const filtered = lists.with(sourceListIndex, {
        ...sourceList,
        cards: sourceList.cards.filter(card => card.id !== cardId),
      });

      const updated = filtered.with(destinationListIndex, {
        ...destinationList,
        cards: destinationList.cards.toSpliced(destinationIndex, 0, {
          ...draggingCard,
          list_id: destinationList.id,
          rank,
        }),
      });

      return updated;
    },
    [lists],
  );

  const positionCard = useCallback(
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
      const isReorder = sourceListIndex === destinationListIndex;
      const { startIndex, finishIndex } = getPositionIndices({
        sourceElements: sourceList.cards,
        destinationElements: lists[destinationListIndex].cards,
        dragging,
        dropTarget: cardTarget,
        axis: 'vertical',
        isReorder,
      });

      if (!isReorder) {
        return moveCard({
          cardId: dragging.id,
          destinationIndex: finishIndex,
          sourceListIndex,
          destinationListIndex,
        });
      }

      if (startIndex === finishIndex) {
        return undefined;
      }

      const reordered = reorderElement({
        elements: sourceList.cards,
        startIndex,
        finishIndex,
      });

      const updated = lists.with(sourceListIndex, {
        ...sourceList,
        cards: reordered,
      });

      return updated;
    },
    [lists, moveCard, getPositionIndices, reorderElement],
  );

  useEffect(() => {
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isListData(source.data),
        onDrop: async ({ source, location }) => {
          const dragging = source.data;
          const listTarget = location.current.dropTargets[0]?.data;

          if (!isListData(dragging) || !isListData(listTarget)) {
            return;
          }

          const { startIndex, finishIndex } = getPositionIndices({
            sourceElements: lists,
            destinationElements: lists,
            dragging,
            dropTarget: listTarget,
            axis: 'horizontal',
            isReorder: true,
          });

          if (startIndex === finishIndex) {
            return;
          }

          const updatedLists = reorderElement({
            elements: lists,
            startIndex,
            finishIndex,
          });

          startTransition(async () => {
            setOptimisticLists(() => updatedLists);

            try {
              const { rank } = updatedLists[finishIndex];

              await updateEntity({
                tableName: 'list',
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
          const [firstTarget, secondTarget] = location.current.dropTargets;
          const listTarget = isListData(firstTarget?.data) ? firstTarget.data : secondTarget?.data;
          const cardTarget = isCardData(firstTarget?.data) ? firstTarget.data : null;

          if (!isCardData(dragging) || !isListData(listTarget)) {
            return;
          }

          const updatedLists = positionCard({
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
              const listIndex = updatedLists.findIndex(list =>
                list.cards.some(card => card.id === dragging.id),
              );
              const list = updatedLists[listIndex];
              const cardIndex = list.cards.findIndex(card => card.id === dragging.id);

              await updateEntity({
                tableName: 'card',
                entityData: { id: dragging.id, list_id: list.id, rank: list.cards[cardIndex].rank },
              });
              startTransition(async () => setLists(updatedLists));
            } catch (error) {
              alert('An error occurred while updating the element');
            }
          });
        },
      }),
      autoScrollForElements({
        canScroll: ({ source }) => isListData(source.data) || isCardData(source.data),
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element: scrollable,
      }),
    );
  }, [lists, getPositionIndices, reorderElement, positionCard, setOptimisticLists]);

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
      const rank = generateRank({ elements: lists, leftIndex: lists.length - 1 }).format();

      startTransition(async () => {
        setOptimisticLists(current => [
          ...current,
          { id: temporalId, name, rank, board_id: boardId, cards: [], created_at: '' },
        ]);

        try {
          const list = await createList({ boardId, name, rank });
          startTransition(async () => setLists(current => [...current, list]));
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while creating the element');
        }
      });
    },
    [lists, setOptimisticLists, boardId],
  );

  const updateList = useCallback(
    (listData: TSubsetWithId<TList>) => {
      startTransition(async () => {
        setOptimisticLists(current => updateElement(current, listData));

        try {
          await updateEntity({
            tableName: 'list',
            entityData: listData,
          });
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
          await deleteEntity({
            tableName: 'list',
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

  const addCard = useCallback(
    (listId: string, name: string) => {
      const temporalId = crypto.randomUUID();
      const listIndex = lists.findIndex(list => list.id === listId);
      const rank = generateRank({
        elements: lists[listIndex].cards,
        leftIndex: lists[listIndex].cards.length - 1,
      }).format();

      startTransition(async () => {
        setOptimisticLists(current => {
          const updated = current.with(listIndex, {
            ...current[listIndex],
            cards: [
              ...current[listIndex].cards,
              {
                id: temporalId,
                name,
                description: '',
                rank,
                list_id: listId,
                comments: [],
                created_at: '',
              },
            ],
          });

          return updated;
        });

        try {
          const card = await createCard({ listId, name, rank });
          startTransition(async () =>
            setLists(current => {
              const updated = current.with(listIndex, {
                ...current[listIndex],
                cards: [...current[listIndex].cards, card],
              });

              return updated;
            }),
          );
        } catch (error) {
          // TODO: Show error with a toast
          alert('An error occurred while creating the element');
        }
      });
    },
    [lists, setOptimisticLists],
  );

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
        className="scrollbar-transparent [-webkit-user-drag: none] flex h-full select-none overflow-x-auto px-2 pb-2 pt-3"
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
