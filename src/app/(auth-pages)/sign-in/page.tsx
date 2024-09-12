import SignInForm from '@/components/sign-in-form';
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
        className="my-1 py-2 text-sm font-medium text-secondary hover:underline">
        Sign Up
      </Link>
    </>
  );
}
