import { TUser } from '@/modules/common/types/db';
import { userKeys } from '@/modules/user/lib/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

export default function userCacheController(queryClient: QueryClient): CacheHandlers<TUser> {
  const defQueryKey = userKeys._def;

  return {
    handleInsert: user => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: user,
      });
    },

    handleUpdate: user => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: user,
      });
    },

    handleDelete: ({ id }) => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: id,
      });
    },
  };
}
