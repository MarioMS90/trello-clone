import { TEntity, TEntityName } from '@/modules/common/types/db';
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
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey });

  queriesData.forEach(([_queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      return;
    }

    queryClient.setQueryData<T[]>(_queryKey, old => {
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
  queryKey,
  entity,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  entity: T;
}) {
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey });

  queriesData.forEach(([_queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      if (data.updatedAt === entity.updatedAt) {
        return;
      }

      queryClient.setQueryData(_queryKey, { ...data, ...entity });
      return;
    }

    queryClient.setQueryData<T[]>(_queryKey, old => {
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
  queryKey,
  entityId,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  entityId: string | undefined;
}) {
  const queriesData = queryClient.getQueriesData<T | T[]>({ queryKey });

  queriesData.forEach(([_queryKey, data]) => {
    if (!data) {
      return;
    }

    if (!Array.isArray(data)) {
      queryClient.removeQueries({ queryKey: _queryKey, exact: true });
      return;
    }

    queryClient.setQueryData<T[]>(_queryKey, old => {
      if (!old) {
        return undefined;
      }

      return old.filter(entity => entity.id !== entityId);
    });
  });
}
