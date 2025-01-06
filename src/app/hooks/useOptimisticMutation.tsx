'use client';

/* eslint no-alert: "off" */

import { ActionState } from '@/types/app-types';
import { useOptimistic, useTransition } from 'react';

export function useOptimisticMutation<T extends { id: string }>(
  elementList: T[],
  {
    updateAction,
    deleteAction,
  }: {
    updateAction?: (item: T) => Promise<ActionState>;
    deleteAction?: (id: string) => Promise<ActionState>;
  },
) {
  enum Action {
    Update = 'update',
    Delete = 'delete',
  }
  const [isPending, startTransition] = useTransition();
  const [optimisticList, setOptimisticElements] = useOptimistic<T[], { action: Action; item: T }>(
    elementList,
    (elements, { action, item }) => {
      switch (action) {
        case Action.Update:
          return elements.map(_item => (_item.id === item.id ? item : _item));
        case Action.Delete:
          return elements.filter(_item => _item.id !== item.id);
        default:
          return elements;
      }
    },
  );

  const handleUpdate = async (item: T) => {
    if (!updateAction) {
      return;
    }

    setOptimisticElements({ action: Action.Update, item });

    try {
      await updateAction(item);
    } catch (error) {
      // TODO: Handle error with a toast
      alert('An error occurred while updating the item');
    }
  };

  const handleDelete = async (item: T) => {
    if (!deleteAction) {
      return;
    }

    setOptimisticElements({ action: Action.Delete, item });

    try {
      await deleteAction(item.id);
    } catch (error) {
      // TODO: Handle error with a toast
      alert('An error occurred while deleting the item');
    }
  };

  return {
    optimisticList,
    isPending,
    optimisticUpdate: (item: T) => startTransition(() => handleUpdate(item)),
    optimisticDelete: (item: T) => startTransition(() => handleDelete(item)),
  };
}
