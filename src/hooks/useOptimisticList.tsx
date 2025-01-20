'use client';

import { TSubsetWithId } from '@/types/types';
import { useOptimistic, useTransition } from 'react';

enum Action {
  Update = 'update',
  Delete = 'delete',
}

export function useOptimisticList<T extends { id: string }>(
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

  const optimisticUpdate = async (entityData: TSubsetWithId<T>) => {
    if (!updateAction) {
      return;
    }

    startTransition(() => {
      setOptimisticList({ action: Action.Update, entityData });

      try {
        updateAction(entityData);
      } catch (error) {
        // TODO: Show error with a toast
        alert('An error occurred while updating the element');
      }
    });
  };

  const optimisticDelete = async (entityData: TSubsetWithId<T>) => {
    if (!deleteAction) {
      return;
    }

    startTransition(() => {
      setOptimisticList({ action: Action.Delete, entityData });

      try {
        deleteAction(entityData.id);
      } catch (error) {
        // TODO: Show error with a toast
        alert('An error occurred while deleting the element');
      }
    });
  };

  return {
    optimisticList,
    isPending,
    optimisticUpdate,
    optimisticDelete,
  };
}
