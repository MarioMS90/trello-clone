import {
  TBoard,
  TCard,
  TEntityName,
  TList,
  TStarredBoard,
  TUser,
  TMember,
  TWorkspace,
} from '@/modules/common/types/db';
import { QueryClient } from '@tanstack/react-query';
import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { Tables } from '@/modules/common/types/database-types';
import { camelizeKeys } from '@/modules/common/utils/utils';
import boardCacheController from '@/modules/common/lib/real-time/cache-controllers/board-cache-controller';
import userCacheController from '@/modules/common/lib/real-time/cache-controllers/user-cache-controller';
import workspaceCacheController from '@/modules/common/lib/real-time/cache-controllers/workspace-cache-controller';
import starredBoardCacheController from '@/modules/common/lib/real-time/cache-controllers/starred-board-cache-controller';
import listCacheController from '@/modules/common/lib/real-time/cache-controllers/list-cache-controller';
import cardCacheController from '@/modules/common/lib/real-time/cache-controllers/card-cache-controller';
import memberCacheController from '@/modules/common/lib/real-time/cache-controllers/member-cache-controller';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

type EntityTypes = {
  users: TUser;
  workspaces: TWorkspace;
  members: TMember;
  boards: TBoard;
  starred_boards: TStarredBoard;
  lists: TList;
  cards: TCard;
};

const controllers = {
  users: userCacheController,
  workspaces: workspaceCacheController,
  members: memberCacheController,
  boards: boardCacheController,
  starred_boards: starredBoardCacheController,
  lists: listCacheController,
  cards: cardCacheController,
} as const satisfies {
  [K in keyof EntityTypes]: (qc: QueryClient) => CacheHandlers<EntityTypes[K]>;
};

function getCacheController<K extends keyof EntityTypes>(
  queryClient: QueryClient,
  table: K,
): CacheHandlers<EntityTypes[K]> | undefined {
  const controller = controllers[table];
  if (!controller) {
    return undefined;
  }

  return controller(queryClient) as CacheHandlers<EntityTypes[K]>;
}

export default function cacheSyncHandler(
  queryClient: QueryClient,
  payload: RealtimePostgresChangesPayload<Tables<TEntityName>>,
) {
  const cacheController = getCacheController(queryClient, payload.table as TEntityName);
  if (!cacheController) {
    return;
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT) {
    cacheController.handleInsert(camelizeKeys(payload.new));
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE) {
    cacheController.handleUpdate(camelizeKeys(payload.new));
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
    cacheController.handleDelete(payload.old.id as string);
  }
}
