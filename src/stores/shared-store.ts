import { TBoard, TCard } from '@/types/db';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

export interface SharedStore {
  workspaceId: string;
  boardId: string;
  setWorkspaceId: (workspaceId: string) => void;
  setIdentifiersByBoard: (board: TBoard) => void;
  setIdentifiersByCard: (card: TCard) => void;
}

const sharedStore = create<SharedStore>()(
  combine(
    {
      workspaceId: '',
      boardId: '',
    },
    set => ({
      setWorkspaceId: (workspaceId: string) => set({ workspaceId }),
      setIdentifiersByBoard: (board: TBoard) =>
        set({ workspaceId: board.workspaceId, boardId: board.id }),
      setIdentifiersByCard: (card: TCard) =>
        set({ workspaceId: card?.workspaceId as string, boardId: card.boardId }),
    }),
  ),
);

export const useSharedStore = <T>(selector: (state: SharedStore) => T) =>
  sharedStore(useShallow(selector));
