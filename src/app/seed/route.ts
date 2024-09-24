import {
  workspaces,
  userWorkspace,
  boards,
  taskLists,
  taks,
  comments,
} from '@/lib/placeholder-data';
import { createClient } from '@/utils/supabase/server';

async function seedWorkspaces(supabase) {
  const { data, error } = await supabase.from('workspace').upsert(workspaces).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedUserWorkspaces(supabase) {
  const { data, error } = await supabase.from('user_workspace').upsert(userWorkspace).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedBoards(supabase) {
  const { data, error } = await supabase.from('board').upsert(boards).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTaskLists(supabase) {
  const { data, error } = await supabase.from('task_list').upsert(taskLists).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTasks(supabase) {
  const { data, error } = await supabase.from('task').upsert(taks).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedComments(supabase) {
  const { data, error } = await supabase.from('comment').upsert(comments).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET() {
  try {
    const supabase = createClient();

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
