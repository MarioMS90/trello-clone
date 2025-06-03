import { useParams } from 'next/navigation';
import { useBoard } from '@/modules/board/lib/queries';
import { useBoardId } from '@/modules/board/hooks/useBoardId';

export function useWorkspaceId() {
  const { id } = useParams<{ id: string }>();
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);

  if (board) {
    return board.workspaceId;
  }

  return id;
}
