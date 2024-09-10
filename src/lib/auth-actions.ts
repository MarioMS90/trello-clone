'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z
    .string({
      invalid_type_error: 'Name must be a string.',
      required_error: 'Name is required.',
    })
    .min(3, 'Name must be at least 3 characters long.'),
  email: z
    .string({ invalid_type_error: 'Email must be a string.', required_error: 'Email is required.' })
    .email('Invalid email address.'),
  password: z
    .string({
      invalid_type_error: 'Password must be a string.',
      required_error: 'Password is required.',
    })
    .min(6, 'Password must be at least 6 characters long.'),
});

const SignUpUser = UserSchema.omit({ id: true });
const SignInUser = UserSchema.omit({ id: true, name: true });

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

  const supabase = createClient();

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

  revalidatePath('/dashboard');
  return redirect('/dashboard');
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

  const supabase = createClient();

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

  revalidatePath('/dashboard');
  return redirect('/dashboard');
}

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/');
};
