import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  supabase.auth.signOut();
  return Response.json({ message: 'Logged out' });
}
