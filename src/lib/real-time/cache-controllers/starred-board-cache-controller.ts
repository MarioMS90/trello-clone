import { TStarredBoard } from '@/types/db';
import { starredBoardKeys } from '@/lib/board/queries';
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
      const newEntity = camelizeKeys(payload.new) as TStarredBoard;

      insertQueryData({
        queryClient,
        queryKey: starredBoardKeys.list().queryKey,
        newEntity,
        sortFn: (a: TStarredBoard, b: TStarredBoard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      });
    },
    handleUpdate: payload => {
      const updatedEntity = camelizeKeys(payload.new) as TStarredBoard;

      updateQueryData({
        queryClient,
        queryKey: starredBoardKeys.list().queryKey,
        updatedEntity,
        sortFn: (a: TStarredBoard, b: TStarredBoard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      });
    },
    handleDelete: payload => {
      const entityId = payload.old.id;

      deleteQueryData({
        queryClient,
        queryKey: starredBoardKeys.list().queryKey,
        entityId,
      });
    },
  };
}
