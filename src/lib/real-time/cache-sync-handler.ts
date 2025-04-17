import {
  MutationType,
  TBoard,
  TCard,
  TComment,
  TEntityName,
  TList,
  TStarredBoard,
  TUser,
  TUserWorkspace,
  TWorkspace,
} from '@/types/db';
import { QueryClient } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Tables } from '@/types/database-types';
import boardCacheController from './cache-controllers/board-cache-controller';
import userCacheController from './cache-controllers/user-cache-controller';
import workspaceCacheController from './cache-controllers/workspace-cache-controller';
import starredBoardCacheController from './cache-controllers/starred-board-cache-controller';
import listCacheController from './cache-controllers/list-cache-controller';
import cardCacheController from './cache-controllers/card-cache-controller';
import commentCacheController from './cache-controllers/comment-cache-controller';
import userWorkspaceCacheController from './cache-controllers/user-workspace-cache-controller';
import { camelizeKeys } from '../utils/utils';
import { CacheHandlers } from './cache-types';

type EntityTypes = {
  users: TUser;
  workspaces: TWorkspace;
  user_workspaces: TUserWorkspace;
  boards: TBoard;
  starred_boards: TStarredBoard;
  lists: TList;
  cards: TCard;
  comments: TComment;
};

const controllers = {
  users: userCacheController,
  workspaces: workspaceCacheController,
  user_workspaces: userWorkspaceCacheController,
  boards: boardCacheController,
  starred_boards: starredBoardCacheController,
  lists: listCacheController,
  cards: cardCacheController,
  comments: commentCacheController,
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

  if (payload.eventType === MutationType.INSERT) {
    cacheController.handleInsert(camelizeKeys(payload.new));
  }

  if (payload.eventType === MutationType.UPDATE) {
    cacheController.handleUpdate(camelizeKeys(payload.old));
  }

  if (payload.eventType === MutationType.DELETE) {
    cacheController.handleDelete(camelizeKeys(payload.old));
  }
}
