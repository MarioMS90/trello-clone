'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/modules/common/utils/utils';
import BoardsIcon from '@/modules/common/components/icons/boards';
import UserIcon from '@/modules/common/components/icons/user';

export default function SidebarLinks({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();

  const links = [
    {
      name: 'Boards',
      href: `/workspaces/${workspaceId}`,
      icon: BoardsIcon,
    },
    {
      name: 'Members',
      href: `/workspaces/${workspaceId}/members`,
      icon: UserIcon,
    },
  ];

  return (
    <ul className="pt-4">
      {links.map(link => (
        <li key={link.name}>
          <Link href={link.href} key={link.name}>
            <div
              className={cn('hover:bg-button-hovered-background py-2', {
                'bg-button-selected-background': pathname === link.href,
              })}>
              <span className="flex items-center gap-3 px-4">
                <link.icon height={16} />
                {link.name}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
