import { TBoard } from '@/types/db';
import { boardKeys } from '@/lib/board/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';

export default function boardCacheController(queryClient: QueryClient): CacheController {
  const { queryKey } = boardKeys.list();
  const sortFn = (a: TBoard, b: TBoard) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return {
    handleInsert: payload => {
      const newEntity = camelizeKeys(payload.new) as TBoard;

      insertQueryData({
        queryClient,
        queryKey,
        newEntity,
        sortFn,
      });
    },

    handleUpdate: payload => {
      const updatedEntity = camelizeKeys(payload.new) as TBoard;

      updateQueryData({
        queryClient,
        queryKey,
        updatedEntity,
      });
    },

    handleDelete: payload => {
      const entityId = payload.old.id;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId,
      });
    },
  };
}
