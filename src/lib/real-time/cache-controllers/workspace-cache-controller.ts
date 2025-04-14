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

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TWorkspace;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
      });
    },
    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TWorkspace;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
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
