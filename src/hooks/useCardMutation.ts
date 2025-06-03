import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { cardKeys } from '@/lib/card/queries';
import { TCard } from '@/types/db';
import { deleteCard, updateCard } from '@/lib/card/actions';
import { TablesUpdate } from '@/types/database-types';
import { useBoardId } from './useBoardId';

export const useCardMutation = () => {
  const queryClient = useQueryClient();
  const boardId = useBoardId();

  const modifyCard = useMutation({
    mutationFn: (variables: TablesUpdate<'cards'> & { id: string }) => updateCard(variables),
    onSuccess: ({ data }) => {
      invariant(data);

      queryClient.setQueryData<TCard>(cardKeys.detail(data.id).queryKey, old => {
        if (!old) {
          return undefined;
        }

        return {
          ...old,
          ...data,
        };
      });
      return queryClient.setQueryData<TCard[]>(cardKeys.list(boardId).queryKey, old => {
        if (!old) {
          return undefined;
        }

        return old.map(_card => (_card.id === data.id ? { ..._card, ...data } : _card));
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

      queryClient.removeQueries({ queryKey: cardKeys.detail(data.id).queryKey });
      return queryClient.setQueryData(cardKeys.list(boardId).queryKey, (old: TCard[]) =>
        old.filter(_card => _card.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return { modifyCard, removeCard };
};
