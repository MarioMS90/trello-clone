import { TList } from '@/types/db';
import { listKeys } from '@/lib/list/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function listCacheController(queryClient: QueryClient): CacheHandlers<TList> {
  return {
    handleInsert: list => {
      insertQueryData({
        queryClient,
        queryKey: listKeys.list(list.boardId).queryKey,
        entity: list,
      });
    },

    handleUpdate: list => {
      updateQueryData({
        queryClient,
        queryKey: listKeys.list(list.boardId).queryKey,
        entity: list,
      });
    },

    handleDelete: list => {
      deleteQueryData({
        queryClient,
        queryKey: listKeys.list(list.boardId).queryKey,
        entityId: list.id,
      });
    },
  };
}
