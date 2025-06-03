import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { boardKeys, starredBoardKeys } from '@/modules/board/lib/queries';
import { TBoard, TStarredBoard } from '@/modules/common/types/db';
import { deleteBoard, updateBoard } from '@/modules/board/lib/actions';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/modules/workspace/hooks/useWorkspaceId';
import { useBoardId } from '@/modules/board/hooks/useBoardId';

export const useBoardMutation = () => {
  const queryClient = useQueryClient();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

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

      // TODO: Fix this crap
      if (boardId === data.id) {
        router.replace(`/workspaces/${workspaceId}`);
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

  return { modifyBoard, removeBoard };
};
