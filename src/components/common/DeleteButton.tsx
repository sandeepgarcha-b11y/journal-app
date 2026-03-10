"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmMessage?: string;
  className?: string;
  /** Extra hidden fields beyond "id" */
  extraFields?: Record<string, string>;
}

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
  className = "rounded-lg px-3 py-1.5 text-xs font-medium text-stone-400 transition-all duration-150 hover:bg-terracotta-50 hover:text-terracotta-600",
  extraFields,
}: Props) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Close modal when Escape is pressed
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      {/* Hidden form — submitted programmatically on confirm */}
      <form ref={formRef} action={action} className="hidden">
        <input type="hidden" name="id" value={id} />
        {extraFields &&
          Object.entries(extraFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
      </form>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-cream-200 bg-white p-6 shadow-warm animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-stone-900">
              Are you sure?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              {confirmMessage}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-cream-200 px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-150 hover:bg-cream-50 hover:-translate-y-px"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:bg-terracotta-600 hover:-translate-y-px active:translate-y-0"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
