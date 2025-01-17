import { TCard, TList, TSubsetWithId } from '@/types/types';
import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

export type BoardContextValue = {
  updateList: (listData: TSubsetWithId<TList>) => void;
  deleteList: (id: string) => void;
  updateCard: (cardData: TSubsetWithId<TCard>) => void;
  deleteCard: (id: string) => void;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const value = useContext(BoardContext);
  invariant(value, 'Cannot find BoardContext provider');
  return value;
}
