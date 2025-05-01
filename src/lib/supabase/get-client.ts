import { createClient } from './client';

const isServer = typeof window === 'undefined';

export async function getClient() {
  if (isServer) {
    return (await import('./server')).createClient();
  }

  return createClient();
}
