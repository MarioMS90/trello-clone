import { TEntityName } from '@/types/db';
import { QueryClient } from '@tanstack/react-query';
import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { Tables } from '@/types/database-types';
import { CacheController } from '@/types/cache-types';
import boardCacheController from './cache-controllers/board-cache-controller';
import userCacheController from './cache-controllers/user-cache-controller';
import workspaceCacheController from './cache-controllers/workspace-cache-controller';
import starredBoardCacheController from './cache-controllers/starred-board-cache-controller';
import listCacheController from './cache-controllers/list-cache-controller';
import cardCacheController from './cache-controllers/card-cache-controller';
import commentCacheController from './cache-controllers/comment-cache-controller';
import userWorkspaceCacheController from './cache-controllers/user-workspace-cache-controller';

function getCacheController(
  queryClient: QueryClient,
  payload: RealtimePostgresChangesPayload<Tables<TEntityName>>,
) {
  const controllers: Partial<Record<string, (queryClient: QueryClient) => CacheController>> = {
    users: userCacheController,
    workspaces: workspaceCacheController,
    user_workspaces: userWorkspaceCacheController,
    boards: boardCacheController,
    starred_boards: starredBoardCacheController,
    lists: listCacheController,
    cards: cardCacheController,
    comments: commentCacheController,
  };

  const controller = controllers[payload.table];
  if (controller) {
    return controller(queryClient);
  }

  return undefined;
}

export default function cacheSyncHandler(
  queryClient: QueryClient,
  payload: RealtimePostgresChangesPayload<Tables<TEntityName>>,
) {
  const cacheController = getCacheController(queryClient, payload);

  if (!cacheController) {
    return;
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT) {
    cacheController.handleInsert(payload);
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE) {
    cacheController.handleUpdate(payload);
  }

  if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
    cacheController.handleDelete(payload);
  }
}
