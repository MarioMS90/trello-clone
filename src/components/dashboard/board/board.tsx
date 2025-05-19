'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { bind, bindAll } from 'bind-event-listener';
import { isCardData, isListData, TCardData, TListData } from '@/types/board-types';
import { TCard, TList } from '@/types/db';
import { useCallback, useEffect, useRef } from 'react';
import { List } from '@/components/dashboard/list/list';
import { generateRank } from '@/lib/utils/utils';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { blockBoardPanningAttr } from '@/constants/constants';
import { listKeys, useLists } from '@/lib/list/queries';
import { cardKeys, useCardsGroupedByList } from '@/lib/card/queries';
import { useRealTimeContext } from '@/providers/real-time-provider';
import { useBoard } from '@/lib/board/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateList } from '@/lib/list/actions';
import { updateCard } from '@/lib/card/actions';
import { notFound } from 'next/navigation';
import { CreateList } from '../list/create-list';

export default function Board({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  const { data: board } = useBoard(boardId);
  const { registerChannel } = useRealTimeContext();
  const scrollableRef = useRef<HTMLUListElement | null>(null);

  if (!board) {
    notFound();
  }

  useEffect(() => {
    registerChannel('lists');
    registerChannel('cards');
    registerChannel('comments');
  }, [registerChannel]);

  const { data: lists } = useLists(boardId);
  const { data: cards } = useCardsGroupedByList(
    boardId,
    lists.map(list => list.id),
  );

  const { queryKey: listsKey } = listKeys.list(boardId);
  const { mutate: moveList } = useMutation({
    mutationFn: ({ listId, rank }: { listId: string; rank: string }) =>
      updateList({ id: listId, rank }),
    onMutate: async ({ listId, rank }: { listId: string; rank: string }) => {
      await queryClient.cancelQueries({ queryKey: listsKey });

      const previous = queryClient.getQueryData<TList[]>(listsKey);
      const previousList = previous?.find(list => list.id === listId);
      invariant(previousList);

      queryClient.setQueryData(listsKey, (old: TList[]) =>
        old.map(list => (list.id === listId ? { ...list, rank } : list)),
      );

      return { previousList };
    },
    onSuccess: async ({ data }) => {
      invariant(data);
      queryClient.setQueryData(listsKey, (old: TList[]) =>
        old.map(list => (list.id === data.id ? { ...list, ...data } : list)),
      );
    },
    onError: (_error, _variables, context) => {
      invariant(context);
      queryClient.setQueryData(listsKey, (old: TList[]) =>
        old.map(list => (list.id === context.previousList.id ? context.previousList : list)),
      );

      alert('An error occurred while updating the element');
    },
  });

  const { queryKey: cardsKey } = cardKeys.list(boardId);
  const { mutate: moveCard } = useMutation({
    mutationFn: ({ cardId, rank, listId }: { cardId: string; rank: string; listId: string }) =>
      updateCard({ id: cardId, rank, list_id: listId }),
    onMutate: async ({
      cardId,
      rank,
      listId,
    }: {
      cardId: string;
      rank: string;
      listId: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: cardsKey });

      const previous = queryClient.getQueryData<TCard[]>(cardsKey);
      const previousCard = previous?.find(card => card.id === cardId);
      invariant(previousCard);

      queryClient.setQueryData(cardsKey, (old: TCard[]) =>
        old.map(card => (card.id === cardId ? { ...card, rank, listId } : card)),
      );

      return { previousCard };
    },
    onSuccess: async ({ data }) => {
      invariant(data);
      queryClient.setQueryData(cardsKey, (old: TCard[]) =>
        old.map(card => (card.id === data.id ? { ...card, ...data } : card)),
      );
    },
    onError: (_error, _variables, context) => {
      invariant(context);
      queryClient.setQueryData(cardsKey, (old: TCard[]) =>
        old.map(card => (card.id === context.previousCard.id ? context.previousCard : card)),
      );

      alert('An error occurred while updating the element');
    },
  });

  const getRank = useCallback(
    <T extends { id: string; rank: string }>({
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
        const lastIndex = source.length - 1;

        if (isReorder && startIndex === lastIndex) {
          return undefined;
        }

        return generateRank(source, lastIndex).format();
      }

      const destinationList = destination ?? source;
      const indexOfTarget = destinationList.findIndex(element => element.id === dropTarget.id);
      const closestEdgeOfTarget = extractClosestEdge(dropTarget);

      if (!isReorder) {
        return generateRank(
          source,
          closestEdgeOfTarget === 'top' ? indexOfTarget - 1 : indexOfTarget,
        ).format();
      }

      const finishIndex = getReorderDestinationIndex({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
        axis,
      });

      if (startIndex === finishIndex) {
        return undefined;
      }

      return generateRank(
        source,
        startIndex < finishIndex ? finishIndex : finishIndex - 1,
      ).format();
    },
    [],
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

          const rank = getRank({
            source: lists,
            dragging,
            dropTarget: listTarget,
            axis: 'horizontal',
          });

          if (!rank) {
            return;
          }

          moveList({ listId: dragging.id, rank });
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

          const destination = dragging.listId !== listTarget.id ? cards[listTarget.id] : undefined;
          const rank = getRank({
            source: cards[listTarget.id],
            destination,
            dragging,
            dropTarget: cardTarget,
            axis: 'vertical',
          });

          if (!rank) {
            return;
          }

          moveCard({ cardId: dragging.id, rank, listId: listTarget.id });
        },
      }),
      autoScrollForElements({
        canScroll: ({ source }) => isListData(source.data) || isCardData(source.data),
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element: scrollable,
      }),
    );
  }, [lists, cards, getRank, moveList, moveCard]);

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
    <div className="relative h-[calc(100%-60px)]">
      {/* position: absolute needed for max-height:100% to be respected internally */}
      <div className="absolute inset-0">
        <ul
          className="scrollbar-transparent [-webkit-user-drag: none] flex h-full overflow-x-auto px-2 pt-3 pb-2 select-none"
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
