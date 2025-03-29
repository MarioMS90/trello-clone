import { QueryClient } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { Tables } from '@/types/database-types';
import Strategy from './strategy';

export class CacheSyncContext {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public syncQueryCache<T extends TEntityName>(
    queryClient: QueryClient,
    payload: RealtimePostgresChangesPayload<Tables<T>>,
  ) {
    if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT) {
      const newEntity = objectToCamel(payload.new);

      queryClient.setQueriesData({ queryKey: payload.table }, (oldData: Tables<T>[]) => {
        if (!oldData) {
          return undefined;
        }

        return [...oldData, newEntity];
      });
    }

    if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
      const deletedEntity = objectToCamel(payload.old);

      queryClient.setQueriesData({ queryKey: payload.table }, (oldData: Tables<T>[]) => {
        if (!oldData) {
          return undefined;
        }

        return oldData.filter(data => data.id !== deletedEntity.id);
      });
    }
  }
}
