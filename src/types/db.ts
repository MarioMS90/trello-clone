import { CamelCasedProperties } from 'type-fest';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { Database, Tables } from './database-types';

export type TSubset<T> = {
  [K in keyof T]?: T[K];
};

export type TSubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & TSubset<T>;

export type TPublicSchema = Database[Extract<keyof Database, 'public'>];

export type TEntityName = keyof TPublicSchema['Tables'];

export type TEntity<T extends TEntityName> = CamelCasedProperties<Omit<Tables<T>, 'updated_at'>>;

export type TUser = TEntity<'users'>;

export type TWorkspace = TEntity<'workspaces'>;

export type TUserWorkspace = TEntity<'user_workspaces'>;

export type TBoard = TEntity<'boards'>;

export type TStarredBoard = TEntity<'starred_boards'>;

export type TList = TEntity<'lists'>;

export type TCard = TEntity<'cards'> & {
  commentCount: number;
};

export type TComment = TEntity<'comments'>;

export enum MutationType {
  INSERT = REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
  UPDATE = REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
  DELETE = REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
}

export type TMutationInsert = {
  data?: { id: string };
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export type TMutationUpdate = {
  data?: { id: string; updatedAt: string };
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export type TMutationDelete = {
  data?: { id: string };
  errors?: {
    name?: string[];
  };
  message?: string | null;
};
