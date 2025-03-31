import { QueryClient } from '@tanstack/react-query';
import { TList } from '@/types/db';
import CacheSyncStrategy from './cache-sync-strategy';

export default class ListStrategy implements CacheSyncStrategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(entityData: TEntity<TEntityName>) {}

  handleUpdate(entityData: TEntity<TEntityName>) {}

  handleDelete(listId: string) {}
}
