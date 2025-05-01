'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = autoResize ? textareaRef : inputRef;

  useEffect(() => {
    const currentRef = activeRef.current;
    invariant(currentRef);

    if (editing) {
      currentRef.select();
    }

    setIsEditing(editing);
  }, [activeRef, editing]);

  const handleEditingChange = (editingState: boolean) => {
    const currentRef = activeRef.current;
    invariant(currentRef);

    if (editingState) {
      currentRef.select();
    }

    setIsEditing(editingState);

    if (onEditingChange) {
      onEditingChange(editingState);
    }
  };

  const commonAttributes: InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> = {
    className: cn(
      'shadow-transition pointer-events-none focus:shadow-transition-effect absolute inset-0 z-[1] grow resize-none overflow-hidden rounded-md bg-gray-200 px-2 py-1.5 text-primary opacity-0 outline-none focus:bg-white',
      { 'static opacity-100 pointer-events-auto': isEditing },
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
        e.currentTarget.value = defaultText;
        handleEditingChange(false);
      }
    },
  };

  return (
    <div className={cn('relative flex grow text-sm', className)}>
      {editOnClick ? (
        <button
          type="button"
          className={cn('z-[2] h-full grow overflow-hidden break-words px-2 py-1.5 text-left', {
            hidden: isEditing,
          })}
          onMouseUp={() => handleEditingChange(true)}>
          {children}
        </button>
      ) : (
        <span
          className={cn('z-[2] h-full grow overflow-hidden break-words px-2 py-1.5 text-left', {
            hidden: isEditing,
          })}>
          {children}
        </span>
      )}

      {autoResize ? (
        <textarea
          ref={textareaRef}
          onChange={() => resizeTextarea(textareaRef)}
          onFocus={() => resizeTextarea(textareaRef)}
          {...commonAttributes}
          rows={1}
        />
      ) : (
        <input ref={inputRef} {...commonAttributes} />
      )}
    </div>
  );
}
