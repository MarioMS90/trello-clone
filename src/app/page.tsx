import Link from 'next/link';
import AtlassianIcon from '@/app/ui/icons/atlassian';
import TrelloIcon from '@/app/ui/icons/trello';
import ToggleForm from '@/app/ui/toggle-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-[100vh] min-w-[100vw] items-center justify-center">
      <div className="login-background"></div>
      <section
        role="main"
        className="flex w-[400px] flex-col rounded bg-white p-7 text-center shadow-md">
        <TrelloIcon height="40px" />
        <ToggleForm />
        <footer className="mt-4 flex flex-col border-t border-gray-300 pt-6 text-xs [&>*>a]:text-secondary">
          <AtlassianIcon height="24px" />
          <p className="py-2">
            Una cuenta para Trello, Jira, Confluence y <Link href="#">más</Link>.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="#">Política de privacidad</Link>•<Link href="#">Aviso de usuario</Link>
          </div>
          <p className="py-2">
            Este sitio está protegido por reCAPTCHA, y se aplican la{' '}
            <Link href="#">política de privacidad</Link> y las
            <Link href="#">condiciones de servicio</Link> de Google.
          </p>
        </footer>
      </section>
    </main>
  );
}
