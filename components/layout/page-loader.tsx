import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({
  label = "Chargement en cours…",
  className,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8E2D8] border-t-[hsl(24_85%_50%)]" />
      <p className="text-sm text-[hsl(36_15%_60%)]">{label}</p>
    </div>
  );
}