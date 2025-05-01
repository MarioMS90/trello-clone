'use server';

import { redirect } from 'next/navigation';
import { SignInUser, SignUpUser } from '@/schemas/auth-schemas';
import { getClient } from '../supabase/get-client';

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

  const supabase = await getClient();

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

  const supabase = await getClient();

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

  return redirect('/workspaces');
}

export const signOut = async () => {
  const supabase = await getClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
