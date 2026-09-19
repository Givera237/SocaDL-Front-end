"use client";

import { cn } from "@/lib/utils";

export type Period = "today" | "7d" | "30d" | "custom";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "custom", label: "Perso." },
];

export function PeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#E8E2D8] bg-white p-1">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#F2751F] text-white"
                : "text-[#6B6459] hover:bg-[#F0EBE2]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}