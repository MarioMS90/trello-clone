import { TEntity, TEntityName } from '@/types/db';
import { QueryClient, QueryKey } from '@tanstack/react-query';

export function insertQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  defQueryKey,
  entity,
}: {
  queryClient: QueryClient;
  defQueryKey: QueryKey;
  entity: T;
}): void {
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey: defQueryKey, exact: false });

  queriesData.forEach(([queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      return;
    }

    queryClient.setQueryData<T[]>(queryKey, old => {
      if (!old) {
        return undefined;
      }

      if (old.some(oldEntity => oldEntity.id === entity.id)) {
        return old;
      }

      return [...old, entity];
    });
  });
}

export function updateQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  defQueryKey,
  entity,
}: {
  queryClient: QueryClient;
  defQueryKey: QueryKey;
  entity: T;
}) {
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey: defQueryKey, exact: false });

  queriesData.forEach(([queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      queryClient.setQueryData(queryKey, { ...data, ...entity });
      return;
    }

    queryClient.setQueryData<T[]>(queryKey, old => {
      if (!old) {
        return undefined;
      }

      if (old.some(oldEntity => oldEntity.updatedAt === entity.updatedAt)) {
        return old;
      }

      return old.map(oldEntity =>
        oldEntity.id === entity.id ? { ...oldEntity, ...entity } : oldEntity,
      );
    });
  });
}

export function deleteQueryData<T extends TEntity<TEntityName>>({
  queryClient,
  defQueryKey,
  entityId,
}: {
  queryClient: QueryClient;
  defQueryKey: QueryKey;
  entityId: string;
}) {
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey: defQueryKey, exact: false });

  queriesData.forEach(([queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      queryClient.removeQueries({ queryKey, exact: true });
      return;
    }

    queryClient.setQueryData<T[]>(queryKey, old => {
      if (!old) {
        return undefined;
      }

      if (!old.some(oldEntity => oldEntity.id === entityId)) {
        return old;
      }

      return old.filter((entity: T) => entity.id !== entityId);
    });
  });
}
