import { Tables } from './database-types';

export type Subset<T> = {
  [K in keyof T]?: T[K];
};

export type SubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & Subset<T>;

export type User = Tables<'user'>;

export type UserWorkspace = Workspace & Pick<Tables<'user_workspace'>, 'role'>;

export type Workspace = Tables<'workspace'> & {
  boards: Board[];
};

export type Board = Tables<'board'> & {
  card_lists?: TCardList[];
  workspaceName?: string;
};

export type TCardList = Tables<'card_list'> & {
  cards?: Card[];
};

export type Card = Tables<'card'> & {
  comments?: Comment[];
};

export type Comment = Tables<'comment'>;

export enum Role {
  Admin = 'admin',
  Member = 'member',
}

export type ActionState = {
  success?: boolean;
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const initialState: ActionState = { success: false, message: null, errors: {} };
