import { TUser } from '@/types/db';
import { userKeys } from '@/lib/user/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';

export default function userCacheController(queryClient: QueryClient): CacheController {
  // Needs the actual workspace
  const { queryKey } = userKeys.list('');
  const sortFn = (a: TUser, b: TUser) => a.name.localeCompare(b.name);

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TUser;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },

    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TUser;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },

    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TUser;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: entity.id,
      });
    },
  };
}
