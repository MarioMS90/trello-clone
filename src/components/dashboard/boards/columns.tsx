'use client';

import { TColumn } from '@/types/app-types';
import { useEffect, useState } from 'react';
import { Column } from '@/components/dashboard/boards/column';

import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import PlusIcon from '@/components/icons/plus';

export default function Columns({ initialColumns }: { initialColumns: TColumn[] }) {
  const [columns, setColumns] = useState<TColumn[]>(initialColumns);

  const {
    optimisticList: optimisticColumns,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(columns, {
    updateAction: entityData => updateEntityAction('board_column', entityData),
    deleteAction: entityId => deleteEntityAction('board_column', entityId),
  });

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  return (
    <ul className="scrollbar-transparent flex h-[calc(100%-8px)] gap-4 overflow-x-auto p-4">
      {optimisticColumns.map(column => (
        <li className="flex h-full flex-row" key={column.id}>
          <Column
            key={column.id}
            column={column}
            onUpdate={optimisticUpdate}
            onDelete={optimisticDelete}
          />
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
