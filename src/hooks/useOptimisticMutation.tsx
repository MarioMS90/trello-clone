'use client';

import { TSubsetWithId } from '@/types/types';
import { useOptimistic, useTransition } from 'react';

enum Action {
  Update = 'update',
  Delete = 'delete',
}

export function useOptimisticMutation<T extends { id: string }>(
  list: T[],
  {
    updateAction,
    deleteAction,
  }: {
    updateAction?: (element: TSubsetWithId<T>) => void;
    deleteAction?: (id: string) => void;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticList, setOptimisticList] = useOptimistic<
    T[],
    { action: Action; entityData: TSubsetWithId<T> }
  >(list, (currentList, { action, entityData }) => {
    switch (action) {
      case Action.Update:
        return currentList.map(entity =>
          entity.id === entityData.id ? { ...entity, ...entityData } : entity,
        );
      case Action.Delete:
        return currentList.filter(entity => entity.id !== entityData.id);
      default:
        return currentList;
    }
  });

  const handleUpdate = async (entityData: TSubsetWithId<T>) => {
    if (!updateAction) {
      return;
    }

    setOptimisticList({ action: Action.Update, entityData });

    try {
      updateAction(entityData);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while updating the element');
    }
  };

  const handleDelete = async (entityData: TSubsetWithId<T>) => {
    if (!deleteAction) {
      return;
    }

    setOptimisticList({ action: Action.Delete, entityData });

    try {
      deleteAction(entityData.id);
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while deleting the element');
    }
  };

  return {
    optimisticList,
    isPending,
    optimisticUpdate: (entityData: TSubsetWithId<T>) =>
      startTransition(() => handleUpdate(entityData)),
    optimisticDelete: (entityData: TSubsetWithId<T>) =>
      startTransition(() => handleDelete(entityData)),
  };
}
