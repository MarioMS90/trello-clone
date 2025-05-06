import { CamelCasedProperties } from 'type-fest';
import { Database, Tables } from './database-types';

export type TPublicSchema = Database[Extract<keyof Database, 'public'>];

export type TEntityName = keyof TPublicSchema['Tables'];

export type TEntity<T extends TEntityName> = CamelCasedProperties<Tables<T>>;

export type TUser = TEntity<'users'>;

export type TRole = TEntity<'roles'>;

export type TUserRole = TUser & { roleId: string; role: TRoleEnum };

export type TWorkspace = TEntity<'workspaces'>;

export type TBoard = TEntity<'boards'>;

export type TStarredBoard = TEntity<'starred_boards'>;

export type TList = TEntity<'lists'>;

export type TCard = TEntity<'cards'>;

export type TCardWithComments = TCard & {
  commentCount: number;
};

export type TComment = TEntity<'comments'>;

export type TRoleEnum = TPublicSchema['Enums']['role'];

export type TMutationWorkspaceInsert = {
  data?: { workspace: TWorkspace; role: TRole };
};

export type TMutationMemberInsert = {
  data?: { user: TUser; role: TRole };
};

export type TMutation<Entity extends TEntity<TEntityName>> = {
  data?: Entity;
};

export type TMutationDelete = {
  data?: { id: string };
};
