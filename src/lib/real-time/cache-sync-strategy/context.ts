import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { camelizeKeys } from '@/lib/utils/utils';
import { TEntityName } from '@/types/db';
import { Tables } from '@/types/database-types';
import CacheSyncStrategy from './cache-sync-strategy';

export class CacheSyncContext {
  private strategy: CacheSyncStrategy;

  constructor(strategy: CacheSyncStrategy) {
    this.strategy = strategy;
  }

  syncQueryCache(payload: RealtimePostgresChangesPayload<Tables<TEntityName>>) {
    if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT) {
      const newEntity = camelizeKeys(payload.new);

      this.strategy.handleInsert(newEntity);
    }

    if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE) {
      const updatedEntity = camelizeKeys(payload.new);

      this.strategy.handleUpdate(updatedEntity);
    }

    if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
      const entityId = payload.old.id;
      if (!entityId) {
        return;
      }

      this.strategy.handleDelete(entityId);
    }
  }
}
