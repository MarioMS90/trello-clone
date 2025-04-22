'use client';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useBoards } from '@/lib/board/queries';
import { SidebarBoard } from './sidebar-board';

export default function SidebarBoards() {
  const workspaceId = useWorkspaceId();
  const { data: boards } = useBoards(workspaceId);

  return (
    <ul>
      {boards.map(board => (
        <SidebarBoard board={board} key={board.id} />
      ))}
    </ul>
  );
}
