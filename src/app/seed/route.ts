import {
  workspaces,
  userWorkspace,
  boards,
  taskLists,
  tasks,
  comments,
} from '@/lib/placeholder-data';
import { createClient } from '@/lib/supabase/server';

async function seedWorkspaces() {
  const supabase = await createClient();
  await supabase.from('workspace').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data, error } = await supabase.from('workspace').upsert(workspaces).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedUserWorkspaces() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('user_workspace').upsert(userWorkspace).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedBoards() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('board').upsert(boards).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTaskLists() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('task_list').upsert(taskLists).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTasks() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('task').upsert(tasks).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedComments() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('comment').upsert(comments).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET() {
  try {
    await seedWorkspaces();
    await seedUserWorkspaces();
    await seedBoards();
    await seedTaskLists();
    await seedTasks();
    await seedComments();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
