import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  supabase.auth.signOut();
  return Response.json({ message: 'Logged out' });
}
