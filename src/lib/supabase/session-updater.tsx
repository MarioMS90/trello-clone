'use client';

export const sessionCookies = new Map<string, string>();

/**
 * This component passes the session info to the client so
 * the Supabase client can use it during server-side prerendering.
 */
export function SessionUpdater({
  authCookie,
  children,
}: {
  authCookie: { name: string; value: string };
  children: React.ReactNode;
}) {
  sessionCookies.set(authCookie.name, authCookie.value);

  return <>{children}</>;
}
