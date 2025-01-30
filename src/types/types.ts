import { Database, Tables } from './database-types';

export type TSubset<T> = {
  [K in keyof T]?: T[K];
};

export type TSubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & TSubset<T>;

export type TPublicSchema = Database[Extract<keyof Database, 'public'>];

export type TUser = Tables<'user'>;

export type TUserWorkspace = TWorkspace & Pick<Tables<'user_workspace'>, 'role'>;

export type TWorkspace = Tables<'workspace'> & {
  boards: TBoard[];
};

export type TBoard = Tables<'board'> & {
  lists?: TList[];
  workspaceName?: string;
};

export type TList = Tables<'list'> & {
  cards: TCard[];
};

export type TCard = Tables<'card'> & {
  comments?: TComment[];
};

export type TComment = Tables<'comment'>;

export type TActionState = {
  success?: boolean;
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const initialState: TActionState = { success: false, message: null, errors: {} };
