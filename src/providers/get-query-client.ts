import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 15 minutes
        staleTime: 15 * 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
