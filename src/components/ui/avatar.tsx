'use client';

import { useCurrentUser } from '@/lib/user/queries';

export default function Avatar() {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-xs text-white">
      {user.name[0].toUpperCase()}
    </div>
  );
}
