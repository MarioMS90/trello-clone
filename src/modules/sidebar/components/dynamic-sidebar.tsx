'use client';

import dynamic from 'next/dynamic';
import { SidebarSkeleton } from '@/modules/common/components/ui/skeletons';

const WorkspaceSidebar = dynamic(() => import('@/modules/sidebar/components/workspace-sidebar'), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
});

export default function DynamicWorkspaceSidebar() {
  return <WorkspaceSidebar />;
}
