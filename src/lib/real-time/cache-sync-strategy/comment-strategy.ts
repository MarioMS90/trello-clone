import { QueryClient } from '@tanstack/react-query';
import { TComment } from '@/types/db';
import Strategy from './strategy';

export default class CommentStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(comment: TComment) {}

  handleUpdate(comment: TComment) {}

  handleDelete(commentId: string) {}
}
