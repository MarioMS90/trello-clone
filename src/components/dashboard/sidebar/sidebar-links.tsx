'use client';

import Link from 'next/link';
import { TWorkspace } from '@/types/types';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import BoardsIcon from '../../icons/boards';
import UserIcon from '../../icons/user';

export default function SidebarLinks({ workspace }: { workspace: TWorkspace }) {
  const pathname = usePathname();

  const links = [
    {
      name: 'Boards',
      href: `/workspaces/${workspace.id}`,
      icon: BoardsIcon,
    },
    {
      name: 'Members',
      href: `/workspaces/${workspace.id}/members`,
      icon: UserIcon,
    },
  ];

  return (
    <ul className="pt-4">
      {links.map(link => (
        <li key={link.name}>
          <Link key={link.name} href={link.href}>
            <div
              className={cn('py-2 hover:bg-button-hovered-background', {
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
