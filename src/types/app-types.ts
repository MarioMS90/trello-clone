import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from './database-types';

export type DBClient = SupabaseClient<Database>;

export type User = Tables<'user'>;

export type UserWorkspace = Workspace & Pick<Tables<'user_workspace'>, 'role'>;

export type Workspace = Tables<'workspace'> & {
  boards: Board[];
};

export type Board = Tables<'board'> & {
  task_lists?: TaskList[];
  workspaceName?: string;
};

export type TaskList = Tables<'task_list'> & {
  tasks: Task[];
};

export type Task = Tables<'task'>;

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
