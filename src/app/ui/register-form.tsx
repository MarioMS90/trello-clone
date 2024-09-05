import { useState } from 'react';

export default function RegisterForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isGeneratedUser, setIsGeneratedUser] = useState(false);
  const TOTAL_POKEMONS = 600;

  const generateRandomUser = async () => {
    const randomId = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();
    const { name } = pokemon;

    setUser({
      name,
      email: `${name}@gmail.com`,
      password: '123456',
    });
    setIsGeneratedUser(true);
  };

  return (
    <>
      <form>
        <h5 className="pb-3 font-semibold">Registrate para continuar</h5>
        <input
          type="text"
          name="name"
          placeholder="Introduce tu nombre"
          value={user.name}
          onChange={e => setUser({ ...user, name: e.target.value })}
          className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"></input>
        <input
          type="email"
          name="email"
          placeholder="Introduce tu correo electrónico"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
          className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"></input>
        <input
          type={isGeneratedUser ? 'text' : 'password'}
          name="password"
          placeholder="Introduce tu contraseña"
          value={user.password}
          onChange={e => setUser({ ...user, password: e.target.value })}
          className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"></input>
        <button
          type="submit"
          className="block w-full rounded bg-secondary py-2 text-sm font-semibold text-white hover:bg-[#0055cc]">
          Registrarse
        </button>
      </form>
      <button
        type="button"
        onClick={generateRandomUser}
        className="my-2 block w-full rounded bg-primary py-2 text-sm font-semibold text-white hover:opacity-90">
        Generar usuario
      </button>
    </>
  );
}
