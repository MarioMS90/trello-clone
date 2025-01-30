import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { workspaces, userWorkspace, boards, lists, cards, comments } from '@/lib/placeholder-data';
import { Database } from '@/types/database-types';

async function seedWorkspaces(supabase: SupabaseClient<Database>) {
  await supabase.from('workspace').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data, error } = await supabase.from('workspace').upsert(workspaces).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedUserWorkspaces(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('user_workspace').upsert(userWorkspace).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedBoards(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('board').upsert(boards).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedLists(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('list').upsert(lists).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedCards(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('card').upsert(cards).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedComments(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('comment').upsert(comments).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET() {
  // This user can bypass RLS policies
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    await seedWorkspaces(supabase);
    await seedUserWorkspaces(supabase);
    await seedBoards(supabase);
    await seedLists(supabase);
    await seedCards(supabase);
    await seedComments(supabase);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
