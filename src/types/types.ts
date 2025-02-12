import { CamelCasedProperties } from 'type-fest';
import { Database, Tables } from './database-types';

export type TSubset<T> = {
  [K in keyof T]?: T[K];
};

export type TSubsetWithId<T extends { id: string }> = {
  id: T['id'];
} & TSubset<T>;

export type TPublicSchema = Database[Extract<keyof Database, 'public'>];

type CamelCaseTable<T extends keyof TPublicSchema['Tables']> = CamelCasedProperties<Tables<T>>;

export type TUser = CamelCaseTable<'user'>;

export type TWorkspace = CamelCaseTable<'workspace'>;

export type TBoard = CamelCaseTable<'board'> & {
  workspaceName?: string;
};

export type TList = CamelCaseTable<'list'>;

export type TCard = CamelCaseTable<'card'>;

export type TComment = CamelCaseTable<'comment'>;

export type TActionState = {
  success?: boolean;
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export const initialActionState: TActionState = { success: false, message: null, errors: {} };
