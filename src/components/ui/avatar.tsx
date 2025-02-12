'use client';

import { useCurrentUser } from '@/providers/main-store-provider';

export default function Avatar() {
  const user = useCurrentUser();

  return (
    <div className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-xs text-white">
      {user.name[0].toUpperCase()}
    </div>
  );
}
