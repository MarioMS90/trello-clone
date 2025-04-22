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
  queryClient.setQueryData<T[]>(queryKey, oldEntities => {
    if (!oldEntities) {
      return undefined;
    }

    if (oldEntities.some(oldEntity => oldEntity.id === entity.id)) {
      return oldEntities;
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
  queryClient.setQueryData<T[]>(queryKey, oldEntities => {
    if (!oldEntities) {
      return undefined;
    }

    if (oldEntities.some(oldEntity => oldEntity.updatedAt === entity.updatedAt)) {
      return oldEntities;
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
  entityId: string;
}) {
  queryClient.setQueryData<T[]>(queryKey, oldEntities => {
    if (!oldEntities) {
      return undefined;
    }

    if (!oldEntities.some(e => e.id === entityId)) {
      return oldEntities;
    }

    return oldEntities.filter((entity: T) => entity.id !== entityId);
  });
}
