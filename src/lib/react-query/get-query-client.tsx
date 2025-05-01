import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// Use react cache to share the same QueryClient instance across all Server Components.
const makeQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          gcTime: Infinity,
        },
        dehydrate: {
          // include pending queries in dehydration
          shouldDehydrateQuery: query =>
            defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        },
      },
    }),
);

let browserQueryClient: QueryClient | undefined;

export default function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
