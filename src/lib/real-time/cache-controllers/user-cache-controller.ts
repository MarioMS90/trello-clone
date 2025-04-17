import { TUser } from '@/types/db';
import { userKeys } from '@/lib/user/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function userCacheController(queryClient: QueryClient): CacheHandlers<TUser> {
  // Needs the actual workspace
  const { queryKey } = userKeys.list('');

  return {
    handleInsert: user => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: user,
      });
    },

    handleUpdate: user => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: user,
      });
    },

    handleDelete: user => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: user.id,
      });
    },
  };
}
