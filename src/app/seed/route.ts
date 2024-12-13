import { createClient } from '@supabase/supabase-js';
import {
  workspaces,
  userWorkspace,
  boards,
  taskLists,
  tasks,
  comments,
} from '@/lib/placeholder-data';
import { DBClient } from '@/types/app-types';
import { Database } from '@/types/database-types';

async function seedWorkspaces(supabase: DBClient) {
  await supabase.from('workspace').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data, error } = await supabase.from('workspace').upsert(workspaces).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedUserWorkspaces(supabase: DBClient) {
  const { data, error } = await supabase.from('user_workspace').upsert(userWorkspace).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedBoards(supabase: DBClient) {
  const { data, error } = await supabase.from('board').upsert(boards).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTaskLists(supabase: DBClient) {
  const { data, error } = await supabase.from('task_list').upsert(taskLists).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTasks(supabase: DBClient) {
  const { data, error } = await supabase.from('task').upsert(tasks).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedComments(supabase: DBClient) {
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
    await seedTaskLists(supabase);
    await seedTasks(supabase);
    await seedComments(supabase);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
