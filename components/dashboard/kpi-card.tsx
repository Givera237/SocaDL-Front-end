import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiTone = "orange" | "red" | "green" | "neutral";

const TONE_TEXT: Record<KpiTone, string> = {
  orange: "text-[#F2751F]",
  red: "text-[#DC2626]",
  green: "text-[#16A34A]",
  neutral: "text-[#1F2937]",
};

const TONE_ICON: Record<KpiTone, string> = {
  orange: "text-[#F2751F]",
  red: "text-[#DC2626]",
  green: "text-[#16A34A]",
  neutral: "text-[#8A8478]",
};

export function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
  tone = "orange",
}: {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone?: KpiTone;
}) {
  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-wide text-[#8A8478]">
          {label}
        </p>
        <Icon className={cn("h-4 w-4 shrink-0", TONE_ICON[tone])} />
      </div>
      <p
        className={cn(
          "mt-2 font-mono text-2xl font-semibold tabular-nums",
          TONE_TEXT[tone]
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-[#9A9284]">{caption}</p>
    </div>
  );
}