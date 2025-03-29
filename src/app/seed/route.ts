import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  workspaces,
  userWorkspace,
  boards,
  starredBoards,
  lists,
  cards,
  comments,
} from '@/dev/placeholder-data';
import { Database } from '@/types/database-types';

async function seedWorkspaces(supabase: SupabaseClient<Database>) {
  await supabase.from('workspaces').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data } = await supabase.from('workspaces').upsert(workspaces).select().throwOnError();

  return data;
}

async function seedUserWorkspaces(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from('user_workspaces')
    .upsert(userWorkspace)
    .select()
    .throwOnError();

  return data;
}

async function seedBoards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('boards').upsert(boards).select().throwOnError();

  return data;
}

async function seedStarredBoards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from('starred_boards')
    .upsert(starredBoards)
    .select()
    .throwOnError();

  return data;
}

async function seedLists(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('lists').upsert(lists).select().throwOnError();

  return data;
}

async function seedCards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('cards').upsert(cards).select().throwOnError();

  return data;
}

async function seedComments(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('comments').upsert(comments).select().throwOnError();

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
    await seedStarredBoards(supabase);
    await seedLists(supabase);
    await seedCards(supabase);
    await seedComments(supabase);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
