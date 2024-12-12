'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SignInUser, SignUpUser } from '@/schemas/auth-schemas';

export type SignUpState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    signUp?: string[];
    signIn?: string[];
  };
  message: string | null;
};

export type SignInState = {
  error: boolean;
  message?: string | null;
};

export async function signInAction(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
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

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
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

  return redirect('/workspaces');
}

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
