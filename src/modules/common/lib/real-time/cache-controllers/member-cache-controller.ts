import { TMember } from '@/modules/common/types/db';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { membersKeys } from '@/modules/user/lib/queries';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

export default function memberCacheController(queryClient: QueryClient): CacheHandlers<TMember> {
  const defQueryKey = membersKeys._def;

  return {
    handleInsert: member => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: member,
      });
    },

    handleUpdate: member => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: member,
      });
    },

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: id,
      });
    },
  };
}
