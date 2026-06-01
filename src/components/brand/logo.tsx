import { brand } from "@/lib/brand";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "h-8 w-8 text-sm", text: "text-base" },
    md: { box: "h-9 w-9 text-sm", text: "text-lg" },
    lg: { box: "h-12 w-12 text-lg", text: "text-2xl" },
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${sizes[size].box} flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 font-bold text-white shadow-md shadow-violet-200`}
      >
        {brand.shortName}
      </div>
      <span className={`${sizes[size].text} font-display font-bold tracking-tight text-stone-900`}>
        {brand.name}
      </span>
    </div>
  );
}
