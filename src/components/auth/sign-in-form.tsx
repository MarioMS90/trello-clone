'use client';

import { signIn, TSignInState } from '@/lib/auth/actions';
import { useActionState } from 'react';

export default function SignInForm() {
  const initialState: TSignInState = { error: false, message: '' };
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction}>
      <h5 className="pb-3 font-semibold">Sign in to continue</h5>
      <input
        className="outline-secondary mb-2 block h-4 w-full rounded-sm border border-gray-500 px-2 py-5 text-sm"
        type="email"
        name="email"
        placeholder="Enter your email"></input>
      <input
        className="outline-secondary mb-2 block h-4 w-full rounded-sm border border-gray-500 px-2 py-5 text-sm"
        type="password"
        name="password"
        placeholder="Enter your password"></input>
      <div id="password-error" aria-live="polite" aria-atomic="true">
        {state.error && <p className="mb-2 text-sm text-red-500">{state.message}</p>}
      </div>
      <button
        className="bg-secondary block w-full cursor-pointer rounded-sm py-2 text-sm font-medium text-white hover:bg-[#0055cc]"
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}>
        Sign In
      </button>
    </form>
  );
}
