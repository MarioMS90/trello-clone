import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { workspaces, members, boards, starredBoards, lists, cards } from '@/dev/placeholder-data';
import { Database } from '@/modules/common/types/database-types';

async function seedWorkspaces(supabase: SupabaseClient<Database>) {
  await supabase.from('workspaces').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data } = await supabase.from('workspaces').insert(workspaces).select().throwOnError();

  return data;
}

async function seedMembers(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('members').insert(members).select().throwOnError();

  return data;
}

async function seedBoards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('boards').insert(boards).select().throwOnError();

  return data;
}

async function seedStarredBoards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase
    .from('starred_boards')
    .insert(starredBoards)
    .select()
    .throwOnError();

  return data;
}

async function seedLists(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('lists').insert(lists).select().throwOnError();

  return data;
}

async function seedCards(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from('cards').insert(cards).select().throwOnError();

  return data;
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json(
      { message: 'Seeding is only allowed in development mode' },
      { status: 403 },
    );
  }

  // This user can bypass RLS policies
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    await seedWorkspaces(supabase);
    await seedMembers(supabase);
    await seedBoards(supabase);
    await seedStarredBoards(supabase);
    await seedLists(supabase);
    await seedCards(supabase);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
