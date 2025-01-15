'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { isColumnData, TColumnData } from '@/types/drag-types';
import { LexoRank } from 'lexorank';
import { TColumn } from '@/types/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Column } from '@/components/dashboard/boards/column';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import PlusIcon from '@/components/icons/plus';

export default function Columns({ initialColumns }: { initialColumns: TColumn[] }) {
  const [columns, setColumns] = useState<TColumn[]>(initialColumns);
  const scrollableRef = useRef<HTMLUListElement | null>(null);
  const setColumnTarget = useState<TColumnData | null>(null)[1];

  const {
    optimisticList: optimisticColumns,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(columns, {
    updateAction: entityData => updateEntityAction('board_column', entityData),
    deleteAction: entityId => deleteEntityAction('board_column', entityId),
  });

  const genLexorank = useCallback(
    (destinationIndex: number) => {
      if (destinationIndex === 0) {
        const parsedLexoRank = LexoRank.parse(columns[destinationIndex + 1].rank);
        return parsedLexoRank.genPrev();
      }

      if (destinationIndex === columns.length - 1) {
        const parsedLexoRank = LexoRank.parse(columns[columns.length - 1].rank);
        return parsedLexoRank.genNext();
      }

      const leftLexorank = LexoRank.parse(columns[destinationIndex - 1].rank);
      const rightLexorank = LexoRank.parse(columns[destinationIndex + 1].rank);

      return leftLexorank.between(rightLexorank);
    },
    [columns],
  );

  const reorderColumnsIfNeeded = useCallback(
    (dragging: TColumnData, dropTarget: TColumnData) => {
      if (dragging.id === dropTarget.id) {
        return;
      }

      const startIndex = columns.findIndex(column => column.id === dragging.id);
      const indexOfTarget = columns.findIndex(column => column.id === dropTarget.id);
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

      const parsedLexoRank = genLexorank(destinationIndex);

      setColumns(prev => {
        const newColumns = prev.with(startIndex, {
          ...columns[startIndex],
          rank: parsedLexoRank.format(),
        });

        const updatedItems = reorder({
          list: newColumns,
          startIndex,
          finishIndex: destinationIndex,
        });

        console.log('updatedItems', updatedItems);

        return updatedItems;
      });
    },
    [columns, genLexorank],
  );

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isColumnData(source.data),
        onDrop: ({ source, location }) => {},

        onDrag: ({ source, location }) => {
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;
          if (!isColumnData(dragging) || !isColumnData(dropTarget)) {
            return;
          }

          setColumnTarget(prev => {
            if (!prev) {
              reorderColumnsIfNeeded(dragging, dropTarget);
              return dropTarget;
            }

            const prevClosestEdge = extractClosestEdge(prev);
            const closestEdge = extractClosestEdge(dropTarget);
            if (prevClosestEdge === closestEdge && prev.id === dropTarget.id) {
              return prev;
            }

            reorderColumnsIfNeeded(dragging, dropTarget);
            return dropTarget;
          });
        },
      }),
    );
  }, [columns, reorderColumnsIfNeeded, setColumnTarget]);

  return (
    <ul className="scrollbar-transparent flex h-full gap-4 overflow-x-auto p-4" ref={scrollableRef}>
      {optimisticColumns.map(column => (
        <li className="flex" key={column.id}>
          <Column column={column} onUpdate={optimisticUpdate} onDelete={optimisticDelete} />
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
          {columns.length ? 'Add another list' : 'Add a list'}
        </button>
      </li>
    </ul>
  );
}
