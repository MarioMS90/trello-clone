'use client';

import { createStore } from 'zustand';
import { TUser, TWorkspace } from '@/types/db';
import { getEntitySliceCreator } from './entity-slice';

export type MainStore = {
  entities: {
    user: TUser;
    workspace: {
      allIds: string[];
      byId: Record<string, TWorkspace>;
    };
  };

  actions: {
    addWorkspace: (workspace: TWorkspace) => void;
    updateWorkspace: (workspace: TWorkspace) => void;
    removeWorkspace: (workspaceId: string) => void;
  };
};

export const createMainStore = ({
  user,
  workspaces,
}: {
  user: TUser;
  workspaces: TWorkspace[];
}) => {
  const createWorkspaceSlice = getEntitySliceCreator(workspaces);

  return createStore<MainStore>()((...a) => ({
    entities: {
      user,
      workspace: {
        ...createWorkspaceSlice(...a).data,
      },
    },
    actions: {
      ...createWorkspaceSlice(...a).actions,
    },
  }));
};
