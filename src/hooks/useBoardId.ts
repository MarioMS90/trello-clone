import { useParams } from 'next/navigation';
import { useCard } from '@/lib/card/queries';
import { useCardId } from './useCardId';

export function useBoardId() {
  const { id } = useParams<{ id: string }>();
  const cardId = useCardId();
  const { data: card } = useCard(cardId);
  if (card) {
    return card.boardId;
  }

  return id;
}
