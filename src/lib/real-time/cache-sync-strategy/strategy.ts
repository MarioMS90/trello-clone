import { TEntity, TEntityName } from '@/types/db';
import { QueryClient } from '@tanstack/react-query';

export default interface Strategy {
  queryClient: QueryClient;

  handleInsert(entityData: TEntity<TEntityName>): void;
  handleUpdate(entityData: TEntity<TEntityName>): void;
  handleDelete(entityId: string): void;
}
