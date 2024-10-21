'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ isValidForm }: { isValidForm: boolean }) {
  const { pending: isPending } = useFormStatus();

  return (
    <button
      className="
        mt-3 
        w-full 
        rounded 
        bg-secondary 
        px-3 
        py-2 
        text-sm 
        font-medium 
        text-white 
        disabled:cursor-not-allowed 
        disabled:bg-gray-200 
        disabled:text-gray-400
      "
      type="submit"
      disabled={!isValidForm || isPending}>
      Create
    </button>
  );
}
