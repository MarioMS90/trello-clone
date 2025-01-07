'use client';

/* eslint no-alert: "off" */

import { ActionState, SubsetWithId } from '@/types/app-types';
import { useOptimistic, useTransition } from 'react';

enum Action {
  Update = 'update',
  Delete = 'delete',
}

export function useOptimisticMutation<T extends { id: string }>(
  elementList: T[],
  {
    updateAction,
    deleteAction,
  }: {
    updateAction?: (element: SubsetWithId<T>) => Promise<ActionState>;
    deleteAction?: (id: string) => Promise<ActionState>;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticList, setOptimisticElements] = useOptimistic<
    T[],
    { action: Action; element: SubsetWithId<T> }
  >(elementList, (elements, { action, element }) => {
    switch (action) {
      case Action.Update:
        return elements.map(_element =>
          _element.id === element.id ? { ..._element, ...element } : _element,
        );
      case Action.Delete:
        return elements.filter(_element => _element.id !== element.id);
      default:
        return elements;
    }
  });

  const handleUpdate = async (element: SubsetWithId<T>) => {
    if (!updateAction) {
      return;
    }

    setOptimisticElements({ action: Action.Update, element });

    try {
      await updateAction(element);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while updating the element');
    }
  };

  const handleDelete = async (element: SubsetWithId<T>) => {
    if (!deleteAction) {
      return;
    }

    setOptimisticElements({ action: Action.Delete, element });

    try {
      await deleteAction(element.id);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while deleting the element');
    }
  };

  return {
    optimisticList,
    isPending,
    optimisticUpdate: (element: SubsetWithId<T>) => startTransition(() => handleUpdate(element)),
    optimisticDelete: (element: SubsetWithId<T>) => startTransition(() => handleDelete(element)),
  };
}
