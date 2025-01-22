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
import { generateRank, updateListObj } from '@/lib/utils/utils';
import { LexoRank } from 'lexorank';
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

  const reorderLists = useCallback(
    ({ listId, finishIndex }: { listId: string; finishIndex: number }) => {
      setLists(current => {
        const startIndex = current.findIndex(list => list.id === listId);

        return reorder({
          list: current,
          startIndex,
          finishIndex,
        });
      });
    },
    [],
  );

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isListData(source.data),
        onDrop: async ({ source, location }) => {
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;

          if (!isListData(dragging)) {
            return;
          }

          if (!isListData(dropTarget)) {
            // Invalid drag operation, revert the order
            reorderLists({
              listId: dragging.id,
              finishIndex: dragging.originalPosition,
            });
            return;
          }

          try {
            const index = lists.findIndex(list => list.id === dragging.id);
            const rank = generateRank(lists, index).format();
            await updateEntityAction({
              tableName: 'board_list',
              entityData: { id: dragging.id, rank },
            });

            setLists(
              lists.with(index, {
                ...lists[index],
                rank,
              }),
            );
          } catch (error) {
            // Revert the order
            reorderLists({
              listId: dragging.id,
              finishIndex: dragging.originalPosition,
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

          setLists(current => {
            const startIndex = current.findIndex(list => list.id === dragging.id);
            const indexOfTarget = current.findIndex(list => list.id === dropTarget.id);
            const closestEdgeOfTarget = extractClosestEdge(dropTarget);
            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: 'horizontal',
            });

            if (startIndex === finishIndex) {
              return current;
            }

            return reorder({
              list: current,
              startIndex,
              finishIndex,
            });
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
  }, [lists, reorderLists]);

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
        setOptimisticLists(current => [...current, { id: temporalId, name } as TList]);

        try {
          const lastList = lists.at(-1);
          const rank = lastList ? LexoRank.parse(lastList.rank).genNext() : LexoRank.middle();
          const list = await createListAction({ boardId, name, rank: rank.format() });
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
        className="scrollbar-transparent [-webkit-user-drag: none] flex h-full select-none gap-4 overflow-x-auto p-4"
        ref={scrollableRef}
        draggable={false}>
        {optimisticLists.map((list, index) => (
          <li className="flex" key={list.id}>
            <List list={list} position={index} />
          </li>
        ))}
        <CreateList buttonText={optimisticLists.length ? 'Add another list' : 'Add a list'} />
      </ul>
    </BoardContext.Provider>
  );
}
