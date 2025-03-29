import { QueryClient } from '@tanstack/react-query';
import { TCard } from '@/types/db';
import Strategy from './strategy';

export default class CardStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(card: TCard) {}

  handleUpdate(card: TCard) {}

  handleDelete(cardId: string) {}
}
