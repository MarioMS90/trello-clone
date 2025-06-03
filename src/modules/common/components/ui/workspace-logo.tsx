import { cn } from '@/modules/common/utils/utils';
import { useWorkspace } from '@/modules/workspace/lib/queries';
import uniqolor from 'uniqolor';

export default function WorkspaceBadge({
  className,
  workspaceId,
}: {
  className?: string;
  workspaceId: string;
}) {
  const { data: workspace } = useWorkspace(workspaceId);
  const { color: bgColor } = uniqolor(workspace.id, { format: 'hex' });

  return (
    <div
      className={cn(
        'bg-secondary text-md flex size-8 items-center justify-center rounded font-bold text-white',
        className,
      )}
      style={{ backgroundColor: bgColor }}>
      {workspace.name[0].toUpperCase()}
    </div>
  );
}
