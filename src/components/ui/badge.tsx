import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
  IN: "bg-green-100 text-green-800",
  OUT: "bg-red-100 text-red-800",
  ADJUSTMENT: "bg-purple-100 text-purple-800",
  ADMIN: "bg-violet-100 text-violet-800",
  STAFF: "bg-indigo-100 text-indigo-800",
  CLIENT: "bg-gray-100 text-gray-800",
  INCOME: "bg-emerald-100 text-emerald-800",
  EXPENSE: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  variant = "PENDING",
  className,
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant] ?? "bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </span>
  );
}
