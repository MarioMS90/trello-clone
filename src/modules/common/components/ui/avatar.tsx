'use client';

import { cn } from '@/modules/common/utils/utils';
import { TUser } from '@/modules/common/types/db';
import uniqolor from 'uniqolor';

export default function Avatar({
  user,
  className,
  title,
}: {
  user: TUser;
  className?: string;
  title?: string;
}) {
  const { color: bgColor } = uniqolor(user.id);

  return (
    <div
      className={cn(
        'bg-primary flex size-6 cursor-pointer items-center justify-center rounded-full text-xs text-white',
        className,
      )}
      title={title ?? `${user.name} (${user.email})`}
      style={{ backgroundColor: bgColor }}>
      {user.name[0].toUpperCase()}
    </div>
  );
}
