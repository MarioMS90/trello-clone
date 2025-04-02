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

export default function starredBoardCacheController(queryClient: QueryClient): CacheController {
  return {
    handleInsert: payload => {
      const newEntity = camelizeKeys(payload.new) as TBoard;

      insertQueryData({
        queryClient,
        queryKey: boardKeys.list().queryKey,
        newEntity,
        sortFn: (a: TBoard, b: TBoard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      });
    },
    handleUpdate: payload => {
      const updatedEntity = camelizeKeys(payload.new) as TBoard;

      updateQueryData({
        queryClient,
        queryKey: boardKeys.list().queryKey,
        updatedEntity,
        sortFn: (a: TBoard, b: TBoard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      });
    },
    handleDelete: payload => {
      const entityId = payload.old.id;

      deleteQueryData({
        queryClient,
        queryKey: boardKeys.list().queryKey,
        entityId,
      });
    },
  };
}
