'use client';

import { type ReactNode, createContext, useRef, useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import { TUser, TWorkspace } from '@/types/types';
import { type MainStore, createMainStore } from '@/stores/main-store';

export type MainStoreApi = ReturnType<typeof createMainStore>;

const MainStoreContext = createContext<MainStoreApi | undefined>(undefined);

export function MainStoreProvider({
  children,
  user,
  workspaces,
}: {
  children: ReactNode;
  user: TUser;
  workspaces: TWorkspace[];
}) {
  const storeRef = useRef<MainStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createMainStore({ user, workspaces });
  }

  return <MainStoreContext.Provider value={storeRef.current}>{children}</MainStoreContext.Provider>;
}

const useMainStore = <T,>(selector: (store: MainStore) => T): T => {
  const mainStoreContext = useContext(MainStoreContext);

  if (!mainStoreContext) {
    throw new Error(`useMainStore must be used within MainStoreProvider`);
  }

  return useStore(mainStoreContext, selector);
};

export const useWorkspaceActions = () => useMainStore(state => state.actions);
export const useCurrentUser = () => useMainStore(({ entities }) => entities.user);
export const useWorkspaces = () => {
  const allIds = useMainStore(({ entities: { workspace } }) => workspace.allIds);
  const byId = useMainStore(({ entities: { workspace } }) => workspace.byId);

  return useMemo(() => allIds.map(id => byId[id]), [allIds, byId]);
};
