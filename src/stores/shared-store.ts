import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

export interface SharedStore {
  workspaceId: string;
  boardId: string;
  setIdentifiers: (identifiers: { workspaceId?: string; boardId?: string }) => void;
}

const sharedStore = create<SharedStore>()(
  combine(
    {
      workspaceId: '',
      boardId: '',
    },
    set => ({
      setIdentifiers: (identifiers: { workspaceId?: string; boardId?: string }) =>
        set((state: SharedStore) => ({ ...state, ...identifiers })),
    }),
  ),
);

export const useSharedStore = <T>(selector: (state: SharedStore) => T) =>
  sharedStore(useShallow(selector));
