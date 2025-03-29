import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
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

export function useBoards() {
  return useSuspenseQuery(boardKeys.list());
}

export function useStarredBoards() {
  return useSuspenseQuery({
    ...starredBoardKeys.list(),
    select: data => data.map(({ boardId }) => boardId),
  });
}
