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
import { TCardWithComments, TList } from '@/types/db';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List } from '@/components/dashboard/list/list';
import { generateRank } from '@/lib/utils/utils';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { blockBoardPanningAttr } from '@/constants/constants';
import { useLists } from '@/lib/list/queries';
import { redirect } from 'next/navigation';
import { useCardsGroupedByList } from '@/lib/card/queries';
import { useRealTimeContext } from '@/providers/real-time-provider';
import { useBoard } from '@/lib/board/queries';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CreateList } from '../list/create-list';

export default function Board({ boardId }: { boardId: string }) {
  const { data: board } = useBoard(boardId);
  const workspaceId = useWorkspaceId();
  const { registerChannel } = useRealTimeContext();
  const scrollableRef = useRef<HTMLUListElement | null>(null);

  if (!board) {
    redirect(`/workspaces/${workspaceId}`);
  }

  const { data: lists } = useLists(boardId);
  // const { data: cards } = useCardsGroupedByList(boardId);

  useEffect(() => {
    registerChannel('lists');
    registerChannel('cards');
    registerChannel('comments');
  }, [registerChannel]);

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

      const rank = generateRank(
        elements,
        startIndex < finishIndex ? finishIndex : finishIndex - 1,
      ).format();

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
      source,
      destination,
      dragging,
      dropTarget,
      axis,
    }: {
      source: T[];
      destination?: T[];
      dragging: TListData | TCardData;
      dropTarget: TListData | TCardData | null;
      axis: 'horizontal' | 'vertical';
    }) => {
      const startIndex = source.findIndex(element => element.id === dragging.id);
      const isReorder = !destination;

      if (!dropTarget) {
        return {
          startIndex,
          finishIndex: !isReorder ? destination.length : source.length - 1,
        };
      }

      const indexOfTarget = isReorder
        ? source.findIndex(element => element.id === dropTarget.id)
        : destination.findIndex(element => element.id === dropTarget.id);
      const closestEdgeOfTarget = extractClosestEdge(dropTarget);

      if (!isReorder) {
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

      const rank = generateRank(destinationList.cards, destinationIndex - 1).format();

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
      const isReorder = sourceListIndex === destinationListIndex;
      const { startIndex, finishIndex } = getPositionIndices({
        source: cards[dragging.listId],
        destination: !isReorder ? cards[listTarget.listId] : undefined,
        dragging,
        dropTarget: cardTarget,
        axis: 'vertical',
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
            source: lists,
            dragging,
            dropTarget: listTarget,
            axis: 'horizontal',
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

  return (
    <div className="relative h-[calc(100%-8px)]">
      {/* position: absolute needed for max-height:100% to be respected internally */}
      <div className="absolute inset-0">
        <ul
          className="scrollbar-transparent [-webkit-user-drag: none] flex h-full select-none overflow-x-auto px-2 pb-2 pt-3"
          ref={scrollableRef}
          draggable={false}>
          {lists.map(list => (
            <List list={list} key={list.id} />
          ))}
          <CreateList boardId={boardId} />
        </ul>
      </div>
    </div>
  );
}
