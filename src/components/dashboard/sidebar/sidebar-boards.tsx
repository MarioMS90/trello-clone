'use client';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useBoardsByWorkspaceId } from '@/lib/board/queries';
import { SidebarBoard } from './sidebar-board';

export default function SidebarBoards() {
  const workspaceId = useWorkspaceId();
  const { data: boards } = useBoardsByWorkspaceId(workspaceId);

  return (
    <ul>
      {boards.map(board => (
        <SidebarBoard key={board.id} board={board} />
      ))}
    </ul>
  );
}
