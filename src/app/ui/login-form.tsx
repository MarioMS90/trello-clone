export default function LoginForm() {
  return (
    <form>
      <h5 className="pb-3 font-semibold">Inicia sesión para continuar</h5>
      <input
        type="email"
        name="email"
        placeholder="Introduce tu correo electrónico"
        className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"></input>
      <input
        type="password"
        name="password"
        placeholder="Introduce tu contraseña"
        className="mb-2 block h-4 w-full rounded border border-gray-500 px-2 py-5 text-sm outline-secondary"></input>
      <button
        type="submit"
        className="block w-full rounded bg-secondary py-2 text-sm font-semibold text-white hover:bg-[#0055cc]">
        Iniciar sesión
      </button>
    </form>
  );
}
