import {
  workspaces,
  userWorkspace,
  boards,
  taskLists,
  taks,
  comments,
} from '@/lib/placeholder-data';
import { createClient } from '@/lib/supabase/server';

async function seedWorkspaces() {
  const supabase = createClient();
  const { data, error } = await supabase.from('workspace').upsert(workspaces).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedUserWorkspaces() {
  const supabase = createClient();
  const { data, error } = await supabase.from('user_workspace').upsert(userWorkspace).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// async function seedBoards() {
//   const supabase = createClient();
//   const { data, error } = await supabase.from('board').upsert(boards).select();

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }

async function seedTaskLists() {
  const supabase = createClient();
  const { data, error } = await supabase.from('task_list').upsert(taskLists).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedTasks() {
  const supabase = createClient();
  const { data, error } = await supabase.from('task').upsert(taks).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function seedComments() {
  const supabase = createClient();
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
    // await seedBoards();
    await seedTaskLists();
    await seedTasks();
    await seedComments();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
