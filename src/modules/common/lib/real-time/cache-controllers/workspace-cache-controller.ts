import { TWorkspace } from '@/modules/common/types/db';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/modules/workspace/lib/queries';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

export default function workspaceCacheController(
  queryClient: QueryClient,
): CacheHandlers<TWorkspace> {
  const queryKey = workspaceKeys._def;

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

    handleDelete: ({ id }) => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: id,
      });
    },
  };
}
