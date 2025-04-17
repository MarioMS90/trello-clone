import { TUserWorkspace } from '@/types/db';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { userWorkspaceKeys } from '@/lib/workspace/queries';
import { CacheHandlers } from '../cache-types';

export default function userWorkspaceCacheController(
  queryClient: QueryClient,
): CacheHandlers<TUserWorkspace> {
  const { queryKey } = userWorkspaceKeys.list();

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

    handleDelete: userWorkspace => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: userWorkspace.id,
      });
    },
  };
}
