import { Tables } from './database-types';

export type UserWorkspace = Workspace & Pick<Tables<'user_workspace'>, 'role'>;

export type Workspace = Tables<'workspace'> & {
  boards: Board[];
};

export type Board = Tables<'board'> & {
  task_lists?: TaskList[];
};

export type TaskList = Tables<'task_list'> & {
  tasks?: Pick<Task, 'id' | 'name' | 'created_at'>[];
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
