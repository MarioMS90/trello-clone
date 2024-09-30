import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import { UserWorkspace } from '@/types/app-types';
import { notFound, useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSelectedWorkspace(): UserWorkspace | null {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const { workspaces } = useWorkspacesStore(store => store);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  const isWorkspacePage = pathname.startsWith('/workspaces/') && id;
  const isBoardPage = pathname.startsWith('/boards/') && id;

  useEffect(() => {
    if (!isWorkspacePage && !isBoardPage) {
      return;
    }

    const workspaceIdParam = isBoardPage ? getWorkspaceIdFromBoard(workspaces, id) : id;
    const selectedWorkspace = workspaces.find(workspace => workspace.id === workspaceIdParam);

    if (!selectedWorkspace) {
      notFound();
    }

    setSelectedWorkspaceId(workspaceIdParam);
  }, [workspaces, isWorkspacePage, isBoardPage, id]);

  return workspaces.find(workspace => workspace.id === selectedWorkspaceId) ?? null;
}

function getWorkspaceIdFromBoard(workspaces: UserWorkspace[], boardId: string): string | null {
  const boards = workspaces.flatMap(workspace => workspace.boards);
  const board = boards.find(_board => _board.id === boardId);

  return board?.workspace_id ?? null;
}
