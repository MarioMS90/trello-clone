import { useSuspenseQuery } from '@tanstack/react-query';
import { TBoard, TStarredBoard } from '@/types/db';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useCallback, useMemo } from 'react';
import { getAuthUser, getClient } from '../supabase/utils';

const fetchBoards = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('boards')
    .select(
      `
      id,
      name,
      workspaceId: workspace_id,
      createdAt: created_at,
      updatedAt: updated_at,
      workspaces!inner(
        users!inner()
      )
    `,
    )
    .eq('workspaces.users.id', user.id)
    .order('created_at')
    .throwOnError();

  return data;
};

const fetchStarredBoards = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('starred_boards')
    .select(
      `
      id,
      userId: user_id,
      boardId: board_id,
      workspaceId: workspace_id,
      createdAt: created_at,
      updatedAt: updated_at
    `,
    )
    .eq('user_id', user.id)
    .order('created_at')
    .throwOnError();

  return data;
};

export const boardKeys = createQueryKeys('boards', {
  list: {
    queryKey: null,
    queryFn: () => fetchBoards(),
  },
});

export const starredBoardKeys = createQueryKeys('starred-boards', {
  list: {
    queryKey: null,
    queryFn: () => fetchStarredBoards(),
  },
});

const useBoardsQuery = <TData = TBoard[]>(select?: (data: TBoard[]) => TData) =>
  useSuspenseQuery({
    ...boardKeys.list,
    select,
  });

export const useStarredBoardsQuery = <TData = TStarredBoard[]>(
  select?: (data: TStarredBoard[]) => TData,
) =>
  useSuspenseQuery({
    ...starredBoardKeys.list,
    select,
  });

export const useBoards = (workspaceId: string) => {
  const { data: starredBoards } = useStarredBoardsQuery();
  const starredIds = useMemo(
    () => new Set(starredBoards.map(starred => starred.boardId)),
    [starredBoards],
  );

  return useBoardsQuery(
    useCallback(
      (boards: TBoard[]) =>
        boards
          .filter(board => board.workspaceId === workspaceId)
          .toSorted((a, b) => (starredIds.has(a.id) ? 0 : 1) - (starredIds.has(b.id) ? 0 : 1)),
      [workspaceId, starredIds],
    ),
  );
};

export const useBoard = (boardId: string) =>
  useBoardsQuery(boards => {
    const index = boards.findIndex(board => board.id === boardId);
    return boards[index];
  });

export const useStarredBoards = () => {
  const { data: starredBoards } = useStarredBoardsQuery();
  const starredIds = useMemo(
    () => new Set(starredBoards.map(starred => starred.boardId)),
    [starredBoards],
  );

  return useBoardsQuery(
    useCallback(
      (boards: TBoard[]) => boards.filter(board => starredIds.has(board.id)),
      [starredIds],
    ),
  );
};

export const useStarredBoardId = (boardId: string) =>
  useStarredBoardsQuery(starredBoards => {
    const index = starredBoards.findIndex(starred => starred.boardId === boardId);
    return starredBoards[index]?.id;
  });
