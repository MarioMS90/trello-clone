import { Workspace } from '@/types/workspaces';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: Workspace[];
  selectedWorkspaceId?: string;
  addWorkspace: (workspace: Workspace) => void;
  setSelectedWorkspaceId: (id: string) => void;
}

export const createWorkspacesStore = (workspaces: Workspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
    setSelectedWorkspaceId: id => set({ selectedWorkspaceId: id }),
  }));
