import { QueryClient } from '@tanstack/react-query';
import { TWorkspace } from '@/types/db';
import CacheSyncStrategy from './cache-sync-strategy';

export default class WorkspaceStrategy implements CacheSyncStrategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(entityData: TEntity<TEntityName>) {}

  handleUpdate(entityData: TEntity<TEntityName>) {}

  handleDelete(workspaceId: string) {}
}
