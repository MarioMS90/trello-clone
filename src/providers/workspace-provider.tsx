'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

type TWorkspaceContextValue = {
  workspaceId: string | null;
  boardId: string | null;
  cardId: string | null;
  setWorkspaceId: (workspaceId: string) => void;
  setBoardId: (boardId: string) => void;
  setCardId: (cardId: string) => void;
};

const WorkspaceContext = createContext<TWorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);

  const contextValue: TWorkspaceContextValue = useMemo(
    () => ({
      workspaceId,
      boardId,
      cardId,
      setWorkspaceId,
      setBoardId,
      setCardId,
    }),
    [workspaceId, boardId, cardId],
  );

  return <WorkspaceContext.Provider value={contextValue}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext(): TWorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  invariant(value, 'Cannot find workspace provider');
  return value;
}
