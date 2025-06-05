'use client';

import { signUp, TSignUpState } from '@/modules/auth/lib/actions';
import Loading from '@/modules/common/components/ui/loading';
import { useState, useActionState } from 'react';

export default function SignUpForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isGeneratedUser, setIsGeneratedUser] = useState(false);
  const initialState: TSignUpState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  const TOTAL_POKEMONS = 1025;

  const generateRandomUser = async () => {
    const randomId = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    setUser({
      name,
      email: `${name}@gmail.com`,
      password: '123456',
    });
    setIsGeneratedUser(true);
  };

  const formErrors = state.errors ? Object.values(state.errors).flat() : [];

  return (
    <>
      <form action={formAction}>
        <h5 className="pb-3 font-semibold">Sign up to continue</h5>
        <input
          className="outline-secondary mb-2 block h-4 w-full rounded-sm border border-gray-500 px-2 py-5 text-sm"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={user.name}
          onChange={e => setUser({ ...user, name: e.target.value })}></input>
        <input
          className="outline-secondary mb-2 block h-4 w-full rounded-sm border border-gray-500 px-2 py-5 text-sm"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}></input>
        <input
          type={isGeneratedUser ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={e => {
            setUser({ ...user, password: e.target.value });
            setIsGeneratedUser(false);
          }}
          className="outline-secondary mb-2 block h-4 w-full rounded-sm border border-gray-500 px-2 py-5 text-sm"></input>
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {formErrors.map((error: string) => (
            <p className="mb-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <button
          className="bg-secondary relative flex h-9 w-full cursor-pointer items-center justify-center rounded-sm py-2 text-sm font-medium text-white hover:bg-[#0055cc] disabled:opacity-60"
          type="submit"
          aria-disabled={isPending}
          disabled={isPending}>
          {isPending ? <Loading /> : 'Sign Up'}
        </button>
      </form>
      <button
        className="bg-primary my-2 block h-9 w-full cursor-pointer rounded-sm py-2 text-sm font-medium text-white hover:opacity-90"
        type="button"
        onClick={generateRandomUser}
        aria-disabled={isPending}
        disabled={isPending}>
        Generate User
      </button>
    </>
  );
}
