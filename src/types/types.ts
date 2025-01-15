import { Database, Tables } from './database-types';

export type Subset<T> = {
  [K in keyof T]?: T[K];
};

export type SubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & Subset<T>;

export type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type User = Tables<'user'>;

export type UserWorkspace = Workspace & Pick<Tables<'user_workspace'>, 'role'>;

export type Workspace = Tables<'workspace'> & {
  boards: Board[];
};

export type Board = Tables<'board'> & {
  columns?: TColumn[];
  workspaceName?: string;
};

export type TColumn = Tables<'board_column'> & {
  cards?: TCard[];
};

export type TCard = Tables<'card'> & {
  comments?: Comment[];
};

export type Comment = Tables<'comment'>;

export type ActionState = {
  success?: boolean;
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const initialState: ActionState = { success: false, message: null, errors: {} };
