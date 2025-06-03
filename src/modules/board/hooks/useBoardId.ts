import { useParams } from 'next/navigation';
import { useCard } from '@/modules/card/lib/queries';
import { useCardId } from '@/modules/card/hooks/useCardId';

export function useBoardId() {
  const { id } = useParams<{ id: string }>();
  const cardId = useCardId();
  const { data: card } = useCard(cardId);
  if (card) {
    return card.boardId;
  }

  return id;
}
