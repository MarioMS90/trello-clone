import { UserWorkspace } from '@/types/app-types';
import { create } from 'zustand';

type WorkspacesStore = {
  workspaces: UserWorkspace[];
  selectedWorkspace: UserWorkspace | null;
  setWorkspaces: (workspaces: UserWorkspace[]) => void;
  setSelectedWorkspace: (workspace: UserWorkspace) => void;
  addWorkspace: (workspace: UserWorkspace) => void;
};

export const useWorkspacesStore = create<WorkspacesStore>()(set => ({
  workspaces: [],
  selectedWorkspace: null,
  setWorkspaces: workspaces => set({ workspaces }),
  setSelectedWorkspace: workspace => set({ selectedWorkspace: workspace }),
  addWorkspace: workspace => set(state => ({ workspaces: [...state.workspaces, workspace] })),
}));
