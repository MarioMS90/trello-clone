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

export type TUserWorkspace = TEntity<'user_workspaces'>;

export type TBoard = TEntity<'boards'>;

export type TStarredBoard = TEntity<'starred_boards'>;

export type TList = TEntity<'lists'>;

export type TCard = TEntity<'cards'>;

export type TCardWithComments = TCard & {
  commentCount: number;
};

export type TComment = TEntity<'comments'>;

export type TMutationWorkspaceInsert = {
  data?: { workspace: TWorkspace; userWorkspace: TUserWorkspace };
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export type TMutation<Entity extends TEntity<TEntityName>> = {
  data?: Entity;
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
