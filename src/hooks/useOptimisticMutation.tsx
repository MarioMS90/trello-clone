'use client';

import { TSubsetWithId } from '@/types/types';
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
    updateAction?: (element: TSubsetWithId<T>) => void;
    deleteAction?: (id: string) => void;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticList, setOptimisticElements] = useOptimistic<
    T[],
    { action: Action; element: TSubsetWithId<T> }
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

  const handleUpdate = async (element: TSubsetWithId<T>) => {
    if (!updateAction) {
      return;
    }

    setOptimisticElements({ action: Action.Update, element });

    try {
      updateAction(element);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while updating the element');
    }
  };

  const handleDelete = async (element: TSubsetWithId<T>) => {
    if (!deleteAction) {
      return;
    }

    setOptimisticElements({ action: Action.Delete, element });

    try {
      deleteAction(element.id);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while deleting the element');
    }
  };

  return {
    optimisticList,
    isPending,
    optimisticUpdate: (element: TSubsetWithId<T>) => startTransition(() => handleUpdate(element)),
    optimisticDelete: (element: TSubsetWithId<T>) => startTransition(() => handleDelete(element)),
  };
}
