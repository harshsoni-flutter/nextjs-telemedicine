interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "accent";
}

export function StatsCard({
  label,
  value,
  icon,
  variant = "default",
}: StatsCardProps) {
  const bgColor = variant === "accent" ? "bg-[#0d9488]" : "bg-white";
  const textColor = variant === "accent" ? "text-white" : "text-[#1a1f2e]";
  const borderColor =
    variant === "accent" ? "border-[#0d9488]" : "border-[#e8e6e1]";

  return (
    <div
      className={`rounded-2xl border ${borderColor} ${bgColor} p-6 sm:p-8`}
    >
      {icon && <div className="mb-4 flex h-10 w-10 items-center justify-center">{icon}</div>}
      <p className={`text-sm font-medium ${variant === "accent" ? "text-white/80" : "text-[#5c6370]"}`}>
        {label}
      </p>
      <p
        className={`mt-2 text-4xl font-bold ${textColor}`}
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {value}
      </p>
    </div>
  );
}
