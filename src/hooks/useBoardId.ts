import { useParams, usePathname } from 'next/navigation';

export function useBoardId() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const isBoardPage = pathname.startsWith('/boards') && id;

  if (!isBoardPage) {
    return null;
  }

  return id;
}
