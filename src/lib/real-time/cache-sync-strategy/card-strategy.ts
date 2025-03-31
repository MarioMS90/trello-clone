import { QueryClient } from '@tanstack/react-query';
import { TCard } from '@/types/db';
import CacheSyncStrategy from './cache-sync-strategy';

export default class CardStrategy implements CacheSyncStrategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(entityData: TEntity<TEntityName>) {}

  handleUpdate(entityData: TEntity<TEntityName>) {}

  handleDelete(cardId: string) {}
}
