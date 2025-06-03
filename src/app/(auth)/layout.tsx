import './login.css';
import TrelloIcon from '@/modules/common/components/icons/trello';
import AtlassianIcon from '@/modules/common/components/icons/atlassian';
import Link from 'next/link';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-[100vh] min-w-[100vw] items-center justify-center">
      <div className="login-background"></div>
      <section
        role="main"
        className="flex w-[400px] flex-col rounded-sm bg-white p-7 text-center shadow-md">
        <TrelloIcon height={40} />
        {children}
        <footer className="[&>*>a]:text-secondary mt-4 flex flex-col border-t border-gray-300 pt-6 text-xs">
          <AtlassianIcon height={24} />
          <p className="py-2">
            One account for Trello, Jira, Confluence, and <Link href="#">more</Link>.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="#">Privacy Policy</Link>•<Link href="#">User Notice</Link>
          </div>
          <p className="py-2">
            This site is protected by reCAPTCHA, and the <Link href="#">privacy policy</Link> and
            <Link href="#">terms of service</Link> of Google apply.
          </p>
        </footer>
      </section>
    </main>
  );
}
