import { UserWorkspace } from '@/types/app-types';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: UserWorkspace[];
  selectedWorkspace: UserWorkspace | null;
  setSelectedWorkspace: (workspace: UserWorkspace) => void;
  addWorkspace: (workspace: UserWorkspace) => void;
}

export const createWorkspacesStore = (workspaces: UserWorkspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    selectedWorkspace: null,
    setSelectedWorkspace: workspace => set({ selectedWorkspace: workspace }),
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
  }));
