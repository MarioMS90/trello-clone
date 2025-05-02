'use client';

import { useUser } from '@/lib/user/queries';
import { cn } from '@/lib/utils/utils';
import uniqolor from 'uniqolor';

export default function Avatar({ userId, className }: { userId: string; className?: string }) {
  const { data: user } = useUser(userId);
  const { color: bgColor } = uniqolor(user.id);

  return (
    <div
      className={cn(
        'bg-primary flex size-6 cursor-pointer items-center justify-center rounded-full text-xs text-white',
        className,
      )}
      style={{ backgroundColor: bgColor }}>
      {user.name[0].toUpperCase()}
    </div>
  );
}
