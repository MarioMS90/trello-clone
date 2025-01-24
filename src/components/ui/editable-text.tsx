'use client';

import {
  InputHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn, resizeTextarea } from '@/lib/utils/utils';
import invariant from 'tiny-invariant';

export default function EditableText({
  className,
  children,
  defaultText,
  onEdit,
  autoResize,
  editOnClick = false,
  editing = false,
  onEditingChange,
}: {
  className?: string;
  children: React.ReactNode;
  defaultText: string;
  onEdit: (newText: string) => void;
  autoResize?: boolean;
  editOnClick?: boolean;
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(editing);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = inputRef.current;
    invariant(textarea);

    if (editing) {
      textarea.select();
    }

    setIsEditing(editing);
  }, [editing]);

  const handleEditingChange = (editingState: boolean) => {
    const input = inputRef.current;
    invariant(input);

    if (editingState) {
      input.select();
    }

    setIsEditing(editingState);

    if (onEditingChange) {
      onEditingChange(editingState);
    }
  };

  const commonAttributes: InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> = {
    className: cn(
      'shadow-transition focus:shadow-transition-effect absolute inset-0 z-[1] grow resize-none overflow-hidden rounded-md bg-gray-200 px-2 py-1.5 text-primary opacity-0 outline-none focus:bg-white',
      { 'static opacity-100': isEditing },
    ),
    defaultValue: defaultText,
    onBlur: e => {
      const newText = e.target.value.trim();
      if (newText && newText !== defaultText) {
        onEdit(newText);
      }
      handleEditingChange(false);
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
    },
    onKeyUp: e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleEditingChange(false);
      }
    },
  };

  return (
    <div className={cn('relative flex grow text-sm', className)}>
      <button
        type="button"
        className={cn('z-[2] h-full grow px-2 py-1.5 text-left', {
          hidden: isEditing,
        })}
        {...(editOnClick && {
          onMouseUp: () => handleEditingChange(true),
        })}>
        {children}
      </button>
      {autoResize ? (
        <textarea
          onChange={() => resizeTextarea(inputRef as RefObject<HTMLTextAreaElement>)}
          onFocus={() => resizeTextarea(inputRef as RefObject<HTMLTextAreaElement>)}
          {...commonAttributes}
          rows={1}
          ref={inputRef as RefObject<HTMLTextAreaElement>}></textarea>
      ) : (
        <input {...commonAttributes} ref={inputRef as RefObject<HTMLInputElement>} />
      )}
    </div>
  );
}
