'use client';

import { useState } from 'react';
import RegisterForm from '@/app/ui/register-form';
import LoginForm from '@/app/ui/login-form';

export default function ToggleForm() {
  const [loginFormOpened, setLoginFormOpened] = useState(false);

  return (
    <div className="toggle-form">
      {!loginFormOpened && (
        <>
          <div className="my-2">
            <RegisterForm />
          </div>
          <button
            type="button"
            onClick={() => setLoginFormOpened(!loginFormOpened)}
            className="my-1 py-2 text-sm font-semibold text-secondary underline">
            Iniciar sesión
          </button>
        </>
      )}
      {loginFormOpened && (
        <>
          <div className="py-4">
            <LoginForm />
          </div>
          <button
            type="button"
            onClick={() => setLoginFormOpened(!loginFormOpened)}
            className="my-1 py-2 text-sm font-semibold text-secondary underline">
            Registrarse
          </button>
        </>
      )}
    </div>
  );
}
