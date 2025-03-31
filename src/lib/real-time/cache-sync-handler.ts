import { TEntityName } from '@/types/db';
import { QueryClient } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Tables } from '@/types/database-types';
import WorkspaceStrategy from './cache-sync-strategy/workspace-strategy';
import UserStrategy from './cache-sync-strategy/user-strategy';
import BoardStrategy from './cache-sync-strategy/board-strategy';
import ListStrategy from './cache-sync-strategy/list-strategy';
import CardStrategy from './cache-sync-strategy/card-strategy';
import CommentStrategy from './cache-sync-strategy/comment-strategy';
import { CacheSyncContext } from './cache-sync-strategy/context';
import StarredBoardStrategy from './cache-sync-strategy/starred-board-strategy';

function cacheSyncFactory(
  queryClient: QueryClient,
  payload: RealtimePostgresChangesPayload<Tables<TEntityName>>,
) {
  switch (payload.table) {
    case 'users':
      return new UserStrategy(queryClient);

    case 'user_workspaces':
      return new WorkspaceStrategy(queryClient);

    case 'boards':
      return new BoardStrategy(queryClient);

    case 'starred_boards':
      return new StarredBoardStrategy(queryClient);

    case 'lists':
      return new ListStrategy(queryClient);

    case 'cards':
      return new CardStrategy(queryClient);

    case 'comments':
      return new CommentStrategy(queryClient);

    default:
      return null;
  }
}

export default function cacheSyncHandler(
  queryClient: QueryClient,
  payload: RealtimePostgresChangesPayload<Tables<TEntityName>>,
) {
  const strategy = cacheSyncFactory(queryClient, payload);

  if (!strategy) {
    return;
  }

  const context = new CacheSyncContext(strategy);
  context.syncQueryCache(payload);
}
