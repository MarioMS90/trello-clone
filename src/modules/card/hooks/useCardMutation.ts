import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { cardKeys } from '@/modules/card/lib/queries';
import { deleteCard, updateCard } from '@/modules/card/lib/actions';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { deleteQueryData, updateQueryData } from '@/modules/common/lib/react-query/utils';

export const useCardMutation = () => {
  const queryClient = useQueryClient();
  const queryKey = cardKeys._def;

  const modifyCard = useMutation({
    mutationFn: (variables: TablesUpdate<'cards'> & { id: string }) => updateCard(variables),
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

  const removeCard = useMutation({
    mutationFn: (id: string) => deleteCard(id),
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

  return { modifyCard, removeCard };
};
