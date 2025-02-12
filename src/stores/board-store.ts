'use client';

import { createStore } from 'zustand';
import { TBoard } from '@/types/types';
import { immer } from 'zustand/middleware/immer';

export type MainStore = {
  entities: {
    board: {
      allIds: string[];
      byId: Record<string, TBoard>;
    };
  };

  actions: {
    addBoard: (board: TBoard) => void;
    updateBoard: (board: TBoard) => void;
    removeBoard: (boardId: string) => void;
  };
};

export const createBoardStore = ({ boards }: { boards: TBoard[] }) =>
  createStore<MainStore>()(
    immer(set => ({
      entities: {
        board: {
          allIds: boards.map(board => board.id),
          byId: boards.reduce((byId, board) => ({ ...byId, [board.id]: board }), {}),
        },
      },
      actions: {
        addBoard: board =>
          set(
            ({
              entities: {
                board: { allIds, byId },
              },
            }) => {
              allIds.push(board.id);
              byId[board.id] = board;
            },
          ),
        updateBoard: board =>
          set(
            ({
              entities: {
                board: { byId },
              },
            }) => {
              byId[board.id] = board;
            },
          ),
        removeBoard: boardId =>
          set(({ entities: { board } }) => {
            board.allIds = board.allIds.filter(id => id !== boardId);
            delete board.byId[boardId];
          }),
      },
    })),
  );
