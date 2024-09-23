export interface Task {
  id: string;
  name: string;
  description?: string;
}

export interface Board {
  id: string;
  name: string;
  marked: boolean;
  tasks: Task[];
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}
