import SignUpForm from '@/components/sign-up-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <>
      <div className="my-2">
        <SignUpForm />
      </div>
      <Link
        type="button"
        href="/sign-in"
        className="my-1 py-2 text-sm font-medium text-secondary hover:underline">
        Sign In
      </Link>
    </>
  );
}
