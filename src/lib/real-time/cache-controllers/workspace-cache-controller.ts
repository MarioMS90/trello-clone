import { TWorkspace } from '@/types/db';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';
import { workspaceKeys } from '@/lib/workspace/queries';

export default function workspaceCacheController(queryClient: QueryClient): CacheController {
  const { queryKey } = workspaceKeys.list();
  const sortFn = (a: TWorkspace, b: TWorkspace) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TWorkspace;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },
    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TWorkspace;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },
    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TWorkspace;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: entity.id,
      });
    },
  };
}
