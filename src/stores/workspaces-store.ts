import { UserWorkspace } from '@/types/types';
import { createStore } from 'zustand';

export interface WorkspacesStore {
  workspaces: UserWorkspace[];
  selectedWorkspaceId?: string;
  addWorkspace: (workspace: UserWorkspace) => void;
  setSelectedWorkspaceId: (id: string) => void;
}

export const createWorkspacesStore = (workspaces: UserWorkspace[]) =>
  createStore<WorkspacesStore>()(set => ({
    workspaces,
    addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
    setSelectedWorkspaceId: id => set({ selectedWorkspaceId: id }),
  }));
