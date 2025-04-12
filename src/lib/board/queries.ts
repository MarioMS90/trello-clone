import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TBoard, TStarredBoard } from '@/types/db';
import { getAuthUser, getClient } from '../supabase/utils';

async function fetchBoards() {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('boards')
    .select(
      `
      id,
      name,
      workspaceId: workspace_id,
      createdAt: created_at,
      workspaces!inner(
        user_workspaces!inner()
      )
    `,
    )
    .eq('workspaces.user_workspaces.user_id', user.id)
    .order('created_at');

  if (error) throw error;

  return data;
}

async function fetchStarredBoards() {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('starred_boards')
    .select(
      `
      id,
      userId: user_id,
      boardId: board_id,
      workspaceId: workspace_id,
      createdAt: created_at
    `,
    )
    .eq('user_id', user.id)
    .order('created_at');

  if (error) throw error;

  return data;
}

export const boardKeys = createQueryKeys('boards', {
  list: () => ({
    queryKey: ['boards'],
    queryFn: async () => fetchBoards(),
  }),
});

export const starredBoardKeys = createQueryKeys('starred_boards', {
  list: () => ({
    queryKey: ['starred_boards'],
    queryFn: async () => fetchStarredBoards(),
  }),
});

export const useBoards = <TData = TBoard[]>(select?: (data: TBoard[]) => TData) =>
  useSuspenseQuery({
    ...boardKeys.list(),
    select,
  });

export const useBoardsByWorkspaceId = (workspaceId: string | null) =>
  useBoards(boards => boards.filter(board => board.workspaceId === workspaceId));

export const useBoard = (boardId: string | null) =>
  useBoards(boards => {
    const index = boards.findIndex(board => board.id === boardId);
    return boards[index];
  });

export const useStarredBoardsQuery = <TData = TStarredBoard[]>(
  select?: (data: TStarredBoard[]) => TData,
) =>
  useSuspenseQuery({
    ...starredBoardKeys.list(),
    select,
  });

export function useStarredBoards() {
  const { data: boards } = useBoards();
  return useStarredBoardsQuery(starredBoards =>
    starredBoards.map(starred => {
      const index = boards.findIndex(board => board.id === starred.boardId);
      return boards[index];
    }),
  );
}

export function useStarredBoard(boardId: string) {
  return useStarredBoardsQuery(starredBoards =>
    starredBoards.some(starred => starred.boardId === boardId),
  );
}
