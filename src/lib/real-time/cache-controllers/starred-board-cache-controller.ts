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
  const { queryKey } = starredBoardKeys.list();
  const sortFn = (a: TStarredBoard, b: TStarredBoard) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TStarredBoard;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },
    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TStarredBoard;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
        sortFn,
      });
    },
    handleDelete: payload => {
      const entity = camelizeKeys(payload.new) as TStarredBoard;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: entity.id,
      });
    },
  };
}
