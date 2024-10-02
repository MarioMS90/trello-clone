import { UserWorkspace } from '@/types/app-types';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: UserWorkspace[];
  selectedWorkspaceId: string | null;
  addWorkspace: (workspace: UserWorkspace) => void;
  setSelectedWorkspaceId: (id: string | null) => void;
}

export const createWorkspacesStore = (workspaces: UserWorkspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    selectedWorkspaceId: null,
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
    setSelectedWorkspaceId: id => set({ selectedWorkspaceId: id }),
  }));
