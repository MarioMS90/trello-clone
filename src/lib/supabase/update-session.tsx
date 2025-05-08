import { notFound } from 'next/navigation';
import { UpdateSessionTokens } from './utils';
import { createClient } from './server';

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
