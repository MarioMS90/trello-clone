import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { TBoard, TStarredBoard } from '@/types/db';
import { deleteBoard, updateBoard } from '@/lib/board/actions';
import { useCurrentUser } from '@/lib/user/queries';
import { useBoardId } from './useBoardId';
import { useWorkspaceId } from './useWorkspaceId';

export const useBoardMutations = () => {
  const queryClient = useQueryClient();
  const currentBoardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrentUser();
  const router = useRouter();

  const updateBoardName = useMutation({
    mutationFn: async (variables: { id: string; name: string }) => updateBoard(variables),

    onSuccess: async ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(boardKeys.list(user.id).queryKey, (old: TBoard[]) =>
        old.map(_board => (_board.id === data.id ? data : _board)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeBoard = useMutation({
    mutationFn: async (id: string) => deleteBoard(id),
    onSuccess: async ({ data }) => {
      invariant(data);

      if (data.id === currentBoardId) {
        router.replace(`/workspaces/${workspaceId}`);
      }

      queryClient.setQueryData(starredBoardKeys.list(user.id).queryKey, (old: TStarredBoard[]) =>
        old.filter(starredBoard => starredBoard.boardId !== data.id),
      );
      return queryClient.setQueryData(boardKeys.list(user.id).queryKey, (old: TBoard[]) =>
        old.filter(_board => _board.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return { updateBoardName, removeBoard };
};
