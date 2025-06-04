'use server';

import { redirect } from 'next/navigation';
import { SignInUser, SignUpUser } from '@/modules/auth/schemas/auth-schemas';
import { LexoRank } from 'lexorank';
import createClient from '@/modules/common/lib/supabase/server';
import { createBoard } from '@/modules/board/lib/actions';
import { createWorkspace } from '@/modules/workspace/lib/actions';
import { createList } from '@/modules/list/lib/actions';
import { createCard } from '@/modules/card/lib/actions';

export type TSignInState = {
  error: boolean;
  message?: string | null;
};

export type TSignUpState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    signUp?: string[];
    signIn?: string[];
  };
  message: string | null;
};

export async function signIn(_: TSignInState, formData: FormData): Promise<TSignInState> {
  const validatedFields = SignInUser.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: true,
      message: 'Missing Fields.',
    };
  }

  const supabase = await createClient();

  const data = {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  return redirect('/workspaces');
}

async function createInitialBoard(userName: string) {
  const workspaceName = `${userName}'s Workspace`;
  const {
    data: { workspace },
  } = await createWorkspace({ name: workspaceName });
  const { data: board } = await createBoard({
    name: `My board`,
    workspace_id: workspace.id,
  });

  const listNames = ['To do', 'In progress', 'Done'];
  let rank = LexoRank.middle();
  const lists = await Promise.all(
    listNames.map(listName => {
      rank = rank.genNext();

      return createList({ name: listName, boardId: board.id, rank: rank.format() });
    }),
  );

  rank = LexoRank.middle();
  await Promise.all(
    lists.map(({ data: list }, index) => {
      rank = rank.genNext();

      return createCard({ name: `Card ${index + 1}`, listId: list.id, rank: rank.format() });
    }),
  );

  return board;
}

export async function signUp(_: TSignUpState, formData: FormData): Promise<TSignUpState> {
  const validatedFields = SignUpUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to sign up.',
    };
  }

  const supabase = await createClient();

  const data = {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      errors: {
        signUp: [error.message],
      },
      message: 'Failed to sign up.',
    };
  }

  const board = await createInitialBoard(validatedFields.data.name);

  return redirect(`/boards/${board.id}`);
}

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
