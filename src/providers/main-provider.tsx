import { fetchUser, fetchWorkspaces } from '@/lib/data';
import { MainStoreProvider } from './main-store-provider';

export async function MainProvider({ children }: { children: React.ReactNode }) {
  const user = await fetchUser();
  const workspaces = await fetchWorkspaces();

  return (
    <MainStoreProvider user={user} workspaces={workspaces}>
      {children}
    </MainStoreProvider>
  );
}
