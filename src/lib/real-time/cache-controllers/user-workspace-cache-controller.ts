import { TUserWorkspace } from '@/types/db';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';
import { userWorkspaceKeys } from '@/lib/workspace/queries';

export default function userWorkspaceCacheController(queryClient: QueryClient): CacheController {
  const { queryKey } = userWorkspaceKeys.list();

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TUserWorkspace;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
      });
    },
    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TUserWorkspace;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
      });
    },
    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TUserWorkspace;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: entity.id,
      });
    },
  };
}
