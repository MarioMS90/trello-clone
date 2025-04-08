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
  const sortFn = (a: TUserWorkspace, b: TUserWorkspace) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TUserWorkspace;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },
    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TUserWorkspace;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
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
