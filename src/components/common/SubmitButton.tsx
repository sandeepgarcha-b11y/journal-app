"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}

/**
 * A submit button that disables itself and shows `pendingText` while the
 * parent form's server action is in flight, using React's `useFormStatus`.
 *
 * Must be rendered *inside* the <form> it belongs to.
 */
export function SubmitButton({
  children,
  pendingText = "Saving…",
  className = "rounded-xl bg-terracotta-500 px-6 py-2 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
