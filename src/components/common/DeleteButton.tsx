"use client";

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
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {extraFields &&
        Object.entries(extraFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
