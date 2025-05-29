import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { TBoard, TStarredBoard } from '@/types/db';
import { deleteBoard, updateBoard } from '@/lib/board/actions';
import { TablesUpdate } from '@/types/database-types';

export const useBoardMutation = () => {
  const queryClient = useQueryClient();

  const modifyBoard = useMutation({
    mutationFn: (variables: TablesUpdate<'boards'> & { id: string }) => updateBoard(variables),

    onSuccess: ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(boardKeys.list.queryKey, (old: TBoard[]) =>
        old.map(_board => (_board.id === data.id ? { ..._board, ...data } : _board)),
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

  return { modifyBoard, removeBoard };
};
