import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';
import { boardKeys, starredBoardKeys, useBoard } from '@/lib/board/queries';
import { TBoard, TStarredBoard } from '@/types/db';
import { deleteBoard, updateBoard } from '@/lib/board/actions';
import { useBoardId } from './useBoardId';

export const useBoardMutation = () => {
  const queryClient = useQueryClient();
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);
  const router = useRouter();

  const updateBoardName = useMutation({
    mutationFn: (variables: { id: string; name: string }) => updateBoard(variables),

    onSuccess: ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(boardKeys.list.queryKey, (old: TBoard[]) =>
        old.map(_board => (_board.id === data.id ? data : _board)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeBoard = useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: ({ data }) => {
      invariant(data);

      if (data.id === boardId) {
        router.replace(`/workspaces/${board.id}`);
      }

      queryClient.setQueryData(starredBoardKeys.list.queryKey, (old: TStarredBoard[]) =>
        old.filter(starredBoard => starredBoard.boardId !== data.id),
      );
      return queryClient.setQueryData(boardKeys.list.queryKey, (old: TBoard[]) =>
        old.filter(_board => _board.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return { updateBoardName, removeBoard };
};
