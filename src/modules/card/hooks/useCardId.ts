import { useParams } from 'next/navigation';

export function useCardId() {
  const { cardId } = useParams<{ cardId: string }>();

  return cardId;
}
