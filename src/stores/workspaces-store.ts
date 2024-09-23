import { Workspace } from '@/types/workspaces';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
}

export const createWorkspacesStore = (workspaces: Workspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
  }));
