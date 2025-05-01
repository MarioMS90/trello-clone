import { useParams } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { cardKeys, fetchCard } from '@/lib/card/queries';
import { fetchList, listKeys } from '@/lib/list/queries';
import { useCardId } from './useCardId';

export function useBoardId() {
  const { id } = useParams<{ id: string }>();
  const cardId = useCardId();
  const { data: card } = useSuspenseQuery({
    queryKey: cardKeys.detail(cardId).queryKey,
    queryFn: async () => (cardId ? fetchCard(cardId) : null),
  });
  const { data: list } = useSuspenseQuery({
    queryKey: listKeys.detail(card?.listId ?? '').queryKey,
    queryFn: async () => (card?.listId ? fetchList(card.listId) : null),
  });

  if (list) {
    return list.boardId;
  }

  return id;
}
