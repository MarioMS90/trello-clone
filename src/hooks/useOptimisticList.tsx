'use client';

import { TSubsetWithId } from '@/types/types';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { useOptimistic, useTransition } from 'react';

enum Action {
  Update = 'update',
  Delete = 'delete',
}

export function useOptimisticList<T extends { id: string }>(list: T[]) {
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

  const optimisticUpdate = (entityData: TSubsetWithId<T>, callbackAction: () => Promise<void>) => {
    startTransition(async () => {
      setOptimisticList({ action: Action.Update, entityData });

      try {
        await callbackAction();
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
        // TODO: Show error with a toast
        alert('An error occurred while updating the element');
      }
    });
  };

  const optimisticDelete = (entityData: TSubsetWithId<T>, callbackAction: () => Promise<void>) => {
    startTransition(async () => {
      setOptimisticList({ action: Action.Delete, entityData });

      try {
        await callbackAction();
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
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
