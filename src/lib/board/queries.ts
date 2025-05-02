import { useSuspenseQuery } from '@tanstack/react-query';
import { TBoard, TStarredBoard } from '@/types/db';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getClient } from '../supabase/get-client';
import { useAuthUser } from '../auth/queries';

const fetchBoards = async (userId: string) => {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('boards')
    .select(
      `
      id,
      name,
      workspaceId: workspace_id,
      createdAt: created_at,
      updatedAt: updated_at,
      workspaces!inner(
        user_workspaces!inner()
      )
    `,
    )
    .eq('workspaces.user_workspaces.user_id', userId)
    .order('created_at');

  if (error) throw error;

  return data;
};

const fetchStarredBoards = async (userId: string) => {
  const supabase = await getClient();

  const { data, error } = await supabase
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
    .eq('user_id', userId)
    .order('created_at');

  if (error) throw error;

  return data;
};

export const boardKeys = createQueryKeys('boards', {
  list: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => fetchBoards(userId),
  }),
});

export const starredBoardKeys = createQueryKeys('starred-boards', {
  list: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => fetchStarredBoards(userId),
  }),
});

const useBoardsQuery = <TData = TBoard[]>(select?: (data: TBoard[]) => TData) => {
  const { data: user } = useAuthUser();

  return useSuspenseQuery({
    ...boardKeys.list(user.id),
    select,
  });
};

export const useBoards = (workspaceId: string) =>
  useBoardsQuery(boards => boards.filter(board => board.workspaceId === workspaceId));

export const useBoard = (boardId: string) =>
  useBoardsQuery(boards => {
    const index = boards.findIndex(board => board.id === boardId);
    return boards[index];
  });

export const useStarredBoardsQuery = <TData = TStarredBoard[]>(
  select?: (data: TStarredBoard[]) => TData,
) => {
  const { data: user } = useAuthUser();

  return useSuspenseQuery({
    ...starredBoardKeys.list(user.id),
    select,
  });
};

export const useStarredBoards = () => {
  const { data: boards } = useBoardsQuery();
  return useStarredBoardsQuery(starredBoards =>
    starredBoards.reduce<TBoard[]>((_boards, starred) => {
      const index = boards.findIndex(board => board.id === starred.boardId);
      return index !== -1 ? [..._boards, boards[index]] : _boards;
    }, []),
  );
};

export const useStarredBoardId = (boardId: string) =>
  useStarredBoardsQuery(starredBoards => {
    const index = starredBoards.findIndex(starred => starred.boardId === boardId);
    return starredBoards[index]?.id;
  });
