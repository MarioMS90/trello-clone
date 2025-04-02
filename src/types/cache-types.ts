import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';
import { Tables } from './database-types';
import { TEntityName } from './db';

export type CacheController = {
  handleInsert: (payload: RealtimePostgresInsertPayload<Tables<TEntityName>>) => void;
  handleUpdate: (payload: RealtimePostgresUpdatePayload<Tables<TEntityName>>) => void;
  handleDelete: (payload: RealtimePostgresDeletePayload<Tables<TEntityName>>) => void;
};
