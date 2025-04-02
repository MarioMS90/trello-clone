import { TEntity, TEntityName } from '@/types/db';
import { QueryClient, QueryKey } from '@tanstack/react-query';

export function insertQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  queryKey,
  newEntity,
  sortFn,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  newEntity: T;
  sortFn?: (a: T, b: T) => number;
}): void {
  queryClient.setQueryData<T[]>(queryKey, (oldEntities: T[] | undefined) => {
    if (!oldEntities) {
      return undefined;
    }

    const updated = [...oldEntities, newEntity];

    if (sortFn) {
      return updated.sort(sortFn);
    }

    return updated;
  });
}

export function updateQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  queryKey,
  updatedEntity,
  sortFn,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updatedEntity: T;
  sortFn?: (a: T, b: T) => number;
}) {
  queryClient.setQueryData<T[]>(queryKey, oldEntities => {
    if (!oldEntities) {
      return undefined;
    }

    const oldEntityIndex = oldEntities.findIndex(entity => entity.id === updatedEntity.id);
    if (oldEntityIndex === -1) {
      return oldEntities;
    }

    const oldEntity = oldEntities[oldEntityIndex];
    const updated = oldEntities.with(oldEntityIndex, { ...oldEntity, ...updatedEntity });

    if (sortFn) {
      return updated.sort(sortFn);
    }

    return updated;
  });
}

export function deleteQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  queryKey,
  entityId,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  entityId: string | undefined;
}) {
  queryClient.setQueryData<T[]>(queryKey, (oldEntities: T[] | undefined) => {
    if (!oldEntities) {
      return undefined;
    }

    return oldEntities.filter((entity: T) => entity.id !== entityId);
  });
}
