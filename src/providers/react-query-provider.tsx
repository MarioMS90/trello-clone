'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

type TSession = {
  accessToken: string;
  refreshToken: string;
};

export const sessionTokens: TSession = {
  accessToken: '',
  refreshToken: '',
};

export default function ReactQueryProvider({
  children,
  currentSession,
}: {
  children: React.ReactNode;
  currentSession: TSession;
}) {
  const queryClient = getQueryClient();

  sessionTokens.accessToken = currentSession.accessToken;
  sessionTokens.refreshToken = currentSession.refreshToken;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
