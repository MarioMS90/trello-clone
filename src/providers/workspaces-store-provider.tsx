'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { WorkspacesStore, createWorkspacesStore } from '@/stores/workspaces-store';
import { UserWorkspace } from '@/types/app-types';

export type WorkspacesStoreApi = ReturnType<typeof createWorkspacesStore>;

export const WorkspacesStoreContext = createContext<WorkspacesStoreApi | undefined>(undefined);

export function WorkspacesStoreProvider({
  children,
  workspaces,
}: {
  children: ReactNode;
  workspaces: UserWorkspace[];
}) {
  const storeRef = useRef<WorkspacesStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createWorkspacesStore(workspaces);
  }

  return (
    <WorkspacesStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkspacesStoreContext.Provider>
  );
}

export const useWorkspacesStore = <T,>(selector: (store: WorkspacesStore) => T): T => {
  const workspacesStoreContext = useContext(WorkspacesStoreContext);

  if (!workspacesStoreContext) {
    throw new Error(`useWorkspacesStore must be used within WorkspacesStoreProvider`);
  }

  return useStore(workspacesStoreContext, selector);
};
