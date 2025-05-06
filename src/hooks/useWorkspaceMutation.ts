import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { TWorkspace } from '@/types/db';
import { deleteWorkspace, updateWorkspace } from '@/lib/workspace/actions';
import { workspaceKeys } from '@/lib/workspace/queries';

export const useWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  const { queryKey } = workspaceKeys.list;

  const updateWorkspaceName = useMutation({
    mutationFn: (variables: { id: string; name: string }) => updateWorkspace(variables),

    onSuccess: ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TWorkspace[]) =>
        old.map(_workspace => (_workspace.id === data.id ? data : _workspace)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeWorkspace = useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TWorkspace[]) =>
        old.filter(_workspace => _workspace.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return { updateWorkspaceName, removeWorkspace };
};
