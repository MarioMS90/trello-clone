export interface Task {
  id: string;
  name: string;
  description?: string;
}

export interface TaskList {
  id: string;
  name: string;
}

export interface Board {
  id: string;
  name: string;
  marked: boolean;
  task_list?: TaskList[];
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}
