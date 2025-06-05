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
  const queryKey = membersKeys._def;

  return {
    handleInsert: member => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: member,
      });
    },

    handleUpdate: member => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: member,
      });
    },

    handleDelete: member => {
      const data = queryClient.getQueriesData<TMember[]>({
        queryKey: queryKey,
      });
      const match = data
        .flatMap(([_, members = []]) => members)
        .find(
          _member => _member.userId === member.userId && _member.workspaceId === member.workspaceId,
        );

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: match?.id,
      });
    },
  };
}
