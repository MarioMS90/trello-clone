'use client';

import { signInAction, SignInState } from '@/lib/auth-actions';
import { useFormState } from 'react-dom';

export default function SignInForm() {
  const initialState: SignInState = { error: false, message: '' };
  const [state, formAction] = useFormState(signInAction, initialState);

  return (
    <form action={formAction}>
      <h5 className="pb-3 font-semibold">Sign in to continue</h5>
      <input
        className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"
        type="email"
        name="email"
        placeholder="Enter your email"></input>
      <input
        className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"
        type="password"
        name="password"
        placeholder="Enter your password"></input>
      <div id="password-error" aria-live="polite" aria-atomic="true">
        {state.error && <p className="mb-2 text-sm text-red-500">{state.message}</p>}
      </div>
      <button
        type="submit"
        className="block w-full rounded bg-secondary py-2 text-sm font-medium text-white hover:bg-[#0055cc]">
        Sign In
      </button>
    </form>
  );
}
