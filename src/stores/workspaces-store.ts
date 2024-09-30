import { UserWorkspace } from '@/types/app-types';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: UserWorkspace[];
  addWorkspace: (workspace: UserWorkspace) => void;
}

export const createWorkspacesStore = (workspaces: UserWorkspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
  }));
