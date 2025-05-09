import { notFound } from 'next/navigation';
import { UpdateSessionTokens } from './client';
import { createClient } from './server';

/**
 * This component manually passes the session info to the client
 * so the Supabase client can use it during server-side prerendering.
 *
 * Cookies aren't accessible during prerendering, so the session is lost
 * for the Supabase client.
 *
 * This step is needed to use `useSuspenseQuery` from React Query
 * along with the `ReactQueryStreamedHydration` component,
 * which runs the `queryFn` during prerendering.
 */
export default async function UpdateSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return notFound();
  }

  return (
    <UpdateSessionTokens
      currentSession={{ accessToken: session.access_token, refreshToken: session.refresh_token }}
    />
  );
}
