import { useParams } from 'next/navigation';
import { useBoard } from '@/lib/board/queries';
import { useBoardId } from './useBoardId';

export function useWorkspaceId() {
  const { id } = useParams<{ id: string }>();
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);

  if (board) {
    return board.workspaceId;
  }

  return id;
}
