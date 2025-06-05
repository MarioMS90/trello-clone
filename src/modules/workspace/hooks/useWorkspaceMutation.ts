import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { deleteWorkspace, updateWorkspace } from '@/modules/workspace/lib/actions';
import { workspaceKeys } from '@/modules/workspace/lib/queries';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { deleteQueryData, updateQueryData } from '@/modules/common/lib/react-query/utils';

export const useWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const { queryKey } = workspaceKeys.list;

  const modifyWorkspace = useMutation({
    mutationFn: (variables: TablesUpdate<'workspaces'> & { id: string }) =>
      updateWorkspace(variables),

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

  const removeWorkspace = useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: ({ data }) => {
      invariant(data);
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

  return { modifyWorkspace, removeWorkspace };
};
