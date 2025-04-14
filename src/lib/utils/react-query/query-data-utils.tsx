import { TEntity, TEntityName } from '@/types/db';
import { QueryClient, QueryKey } from '@tanstack/react-query';

export function insertQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  queryKey,
  entity,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  entity: T;
}): void {
  queryClient.setQueryData<T[]>(queryKey, (oldEntities: T[] | undefined) => {
    if (!oldEntities) {
      return undefined;
    }

    return [...oldEntities, entity];
  });
}

export function updateQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  queryKey,
  entity,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  entity: T;
}) {
  queryClient.setQueryData<T[]>(queryKey, (oldEntities: T[] | undefined) => {
    if (!oldEntities) {
      return undefined;
    }

    return oldEntities.map(oldEntity =>
      oldEntity.id === entity.id ? { ...oldEntity, ...entity } : oldEntity,
    );
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
