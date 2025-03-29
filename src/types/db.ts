import { CamelCasedProperties } from 'type-fest';
import { Database, Tables } from './database-types';

export type TSubset<T> = {
  [K in keyof T]?: T[K];
};

export type TSubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & TSubset<T>;

export type TPublicSchema = Database[Extract<keyof Database, 'public'>];

export type TEntityName = keyof TPublicSchema['Tables'];

export type TEntity<T extends TEntityName> = CamelCasedProperties<Tables<T>>;

export type TUser = TEntity<'users'>;

export type TWorkspace = TEntity<'workspaces'>;

export type TBoard = TEntity<'boards'>;

export type TStarredBoard = TEntity<'starred_boards'>;

export type TList = TEntity<'lists'>;

export type TCard = TEntity<'cards'>;

export type TComment = TEntity<'comments'>;

export type TActionState<T = unknown> = {
  data?: T;
  success?: boolean;
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const initialActionState: TActionState = {
  data: null,
  success: false,
  errors: {},
  message: null,
};
