import { TEntity, TEntityName } from '@/types/db';
import { QueryClient } from '@tanstack/react-query';

export default interface CacheSyncStrategy {
  queryClient: QueryClient;

  handleInsert(newEntity: TEntity<TEntityName>): void;
  handleUpdate(updatedEntity: TEntity<TEntityName>): void;
  handleDelete(entityId: string): void;
}
