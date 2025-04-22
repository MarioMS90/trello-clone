import { TWorkspace } from '@/types/db';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/lib/workspace/queries';
import { CacheHandlers } from '../cache-types';

export default function workspaceCacheController(
  queryClient: QueryClient,
): CacheHandlers<TWorkspace> {
  const { queryKey } = workspaceKeys.list();

  return {
    handleInsert: workspace => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: workspace,
      });
    },

    handleUpdate: workspace => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: workspace,
      });
    },

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: id,
      });
    },
  };
}
