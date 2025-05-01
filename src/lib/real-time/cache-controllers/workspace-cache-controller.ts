import { TWorkspace } from '@/types/db';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/lib/workspace/queries';
import { CacheHandlers } from '../cache-types';

export default function workspaceCacheController(
  queryClient: QueryClient,
): CacheHandlers<TWorkspace> {
  const defQueryKey = workspaceKeys._def;

  return {
    handleInsert: workspace => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: workspace,
      });
    },

    handleUpdate: workspace => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: workspace,
      });
    },

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: id,
      });
    },
  };
}
