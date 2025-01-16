'use client';

import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { isCardData, isColumnData, TColumnData } from '@/types/drag-types';
import { TCard, TColumn } from '@/types/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Column } from '@/components/dashboard/boards/column';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import PlusIcon from '@/components/icons/plus';
import { generateRank } from '@/lib/utils/utils';

type ColumnDrag = {
  type: 'column';
  initialIndex: number;
  column: TColumn;
};

type CardDrag = {
  type: 'card';
  initialIndex: number;
  column: TColumn;
  card: TCard;
};

type CurrentDrag = ColumnDrag | CardDrag;

type ColumnsState = {
  columns: TColumn[];
  currentDrag: CurrentDrag | null;
};

export default function Columns({ initialColumns }: { initialColumns: TColumn[] }) {
  const [columnsData, setColumnsData] = useState<ColumnsState>({
    columns: initialColumns,
    currentDrag: null,
  });
  const scrollableRef = useRef<HTMLUListElement | null>(null);

  const {
    optimisticList: optimisticColumns,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(columnsData.columns, {
    updateAction: entityData => updateEntityAction('board_column', entityData),
    deleteAction: entityId => deleteEntityAction('board_column', entityId),
  });

  const findReorderIndices = useCallback(
    <T extends { id: string }>(
      list: T[],
      dragging: TColumnData,
      dropTarget: TColumnData,
      axis: 'horizontal' | 'vertical',
    ) => {
      const startIndex = list.findIndex(column => column.id === dragging.id);
      const indexOfTarget = list.findIndex(column => column.id === dropTarget.id);
      const closestEdgeOfTarget = extractClosestEdge(dropTarget);
      const destinationIndex = getReorderDestinationIndex({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
        axis,
      });
      return { startIndex, destinationIndex };
    },
    [],
  );

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isColumnData(source.data),
        onDrop: ({ source, location }) => {
          const { columns, currentDrag } = columnsData;

          if (!currentDrag || currentDrag.type !== 'column') {
            return;
          }

          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;
          const destinationIndex = columns.findIndex(column => column.id === dragging.id);

          if (!isColumnData(dropTarget)) {
            // Revert to initial position
            setColumnsData({
              columns: reorder({
                list: columns,
                startIndex: destinationIndex,
                finishIndex: currentDrag.initialIndex,
              }),
              currentDrag: null,
            });
            return;
          }

          // Needs the correct db order
          const rank = generateRank(columns, currentDrag.initialIndex, destinationIndex).format();

          // const updatedColumns = columns.with(startIndex, {
          //   ...column,
          //   rank,
          // });

          // updateEntityAction('board_column', {
          //   id: currentDrag.column.id,
          //   rank: generateRank(
          //     columnsData.columns,
          //     currentDrag.initialIndex,
          //     location.current.dropTargets[0].index,
          //   ).format(),
          // });
        },

        onDrag: ({ source, location }) => {
          const dragging = source.data;
          const dropTarget = location.current.dropTargets[0]?.data;
          if (!isColumnData(dragging) || !isColumnData(dropTarget)) {
            return;
          }

          const { startIndex, destinationIndex } = findReorderIndices(
            columnsData.columns,
            dragging,
            dropTarget,
            'horizontal',
          );

          if (startIndex === destinationIndex) {
            return;
          }

          setColumnsData(prev => {
            const { columns } = prev;
            const column = columns[startIndex];
            const currentDrag = prev.currentDrag ?? {
              type: 'column',
              initialIndex: startIndex,
              column,
            };

            return {
              columns: reorder({
                list: columns,
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
          return isColumnData(source.data) || isCardData(source.data);
        },
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element,
      }),
    );
  }, [columnsData, findReorderIndices]);

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
          {optimisticColumns.length ? 'Add another list' : 'Add a list'}
        </button>
      </li>
    </ul>
  );
}
