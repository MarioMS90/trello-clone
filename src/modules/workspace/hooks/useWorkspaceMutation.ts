import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { TWorkspace } from '@/modules/common/types/db';
import { deleteWorkspace, updateWorkspace } from '@/modules/workspace/lib/actions';
import { workspaceKeys } from '@/modules/workspace/lib/queries';
import { TablesUpdate } from '@/modules/common/types/database-types';

export const useWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  const { queryKey } = workspaceKeys.list;

  const modifyWorkspace = useMutation({
    mutationFn: (variables: TablesUpdate<'workspaces'> & { id: string }) =>
      updateWorkspace(variables),

    onSuccess: ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TWorkspace[]) =>
        old.map(_workspace =>
          _workspace.id === data.id ? { ..._workspace, ...data } : _workspace,
        ),
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

  return { modifyWorkspace, removeWorkspace };
};
