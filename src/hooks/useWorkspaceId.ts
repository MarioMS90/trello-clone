import { useParams, usePathname } from 'next/navigation';
import { useBoard } from '@/lib/board/queries';
import { useBoardId } from './useBoardId';

export function useWorkspaceId() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const isWorkspacePage = pathname.startsWith('/workspaces') && id;
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);

  if (!isWorkspacePage && !board) {
    return null;
  }

  if (isWorkspacePage) {
    return id;
  }

  return board.workspaceId;
}
