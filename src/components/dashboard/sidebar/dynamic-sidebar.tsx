'use client';

import { SidebarSkeleton } from '@/components/ui/skeletons';
import dynamic from 'next/dynamic';

const WorkspaceSidebar = dynamic(() => import('./workspace-sidebar'), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
});

export default function DynamicSidebar() {
  return <WorkspaceSidebar />;
}
