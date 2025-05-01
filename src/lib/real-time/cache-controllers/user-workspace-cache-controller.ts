import { TUserWorkspace } from '@/types/db';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { userWorkspaceKeys } from '@/lib/workspace/queries';
import { CacheHandlers } from '../cache-types';

export default function userWorkspaceCacheController(
  queryClient: QueryClient,
): CacheHandlers<TUserWorkspace> {
  const queryKey = userWorkspaceKeys._def;

  return {
    handleInsert: userWorkspace => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: userWorkspace,
      });
    },

    handleUpdate: userWorkspace => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: userWorkspace,
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
