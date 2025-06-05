import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { boardKeys } from '@/modules/board/lib/queries';
import { deleteBoard, updateBoard } from '@/modules/board/lib/actions';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/modules/workspace/hooks/useWorkspaceId';
import { useBoardId } from '@/modules/board/hooks/useBoardId';
import { updateQueryData, deleteQueryData } from '@/modules/common/lib/react-query/utils';

export const useBoardMutation = () => {
  const queryClient = useQueryClient();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { queryKey } = boardKeys.list;

  const modifyBoard = useMutation({
    mutationFn: (variables: TablesUpdate<'boards'> & { id: string }) => updateBoard(variables),

    onSuccess: ({ data }) => {
      invariant(data);
      updateQueryData({
        queryClient,
        queryKey,
        entity: data,
      });
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

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: data.id,
      });
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return { modifyBoard, removeBoard };
};
