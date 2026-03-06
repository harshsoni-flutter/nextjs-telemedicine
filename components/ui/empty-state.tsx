interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const IconComponent = () =>
    icon || (
      <svg
        className="h-12 w-12 text-[#ccfbf1]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    );

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#e8e6e1] p-8 sm:p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488]">
          <IconComponent />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[#1a1f2e]">{title}</h3>
      {description && (
        <p className="mt-2 text-[#5c6370]">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex rounded-full bg-[#0d9488] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#0f766e]"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex rounded-full bg-[#0d9488] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#0f766e]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
