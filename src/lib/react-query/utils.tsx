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
  queryClient.setQueriesData<T | T[]>({ queryKey, exact: false }, old => {
    if (!old || !Array.isArray(old)) {
      return undefined;
    }

    if (old.some(oldEntity => oldEntity.id === entity.id)) {
      return old;
    }

    return [...old, entity];
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
  queryClient.setQueriesData<T | T[]>({ queryKey, exact: false }, old => {
    if (!old) {
      return undefined;
    }

    if (!Array.isArray(old)) {
      return { ...old, ...entity };
    }

    if (old.some(oldEntity => oldEntity.updatedAt === entity.updatedAt)) {
      return old;
    }

    return old.map(oldEntity =>
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
  const data = queryClient.getQueriesData<T | T[]>({ queryKey, exact: false });

  queryClient.setQueriesData<T | T[]>({ queryKey, exact: false }, old => {
    if (!old) {
      return undefined;
    }

    if (!Array.isArray(old)) {
      return [];
    }

    if (!old.some(oldEntity => oldEntity.id === entityId)) {
      return old;
    }

    return old.filter((entity: T) => entity.id !== entityId);
  });
}
