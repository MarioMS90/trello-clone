import SignInForm from '@/modules/auth/components/sign-in-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <>
      <div className="my-2">
        <SignInForm />
      </div>
      <Link
        type="button"
        href="/sign-up"
        className="text-secondary my-1 py-2 text-sm font-medium hover:underline">
        Sign Up
      </Link>
    </>
  );
}
