"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Zone = {
  id: string;
  label: string;
};

const DEFAULT_ZONES: Zone[] = [
  { id: "all", label: "Toutes les zones" },
  { id: "yaounde", label: "Yaoundé" },
  { id: "douala", label: "Douala" },
  { id: "bamenda", label: "Bamenda" },
  { id: "garoua", label: "Garoua" },
  { id: "ebolowa", label: "Ébolowa" },
];

export function ZoneSelector({
  value,
  onChange,
  zones = DEFAULT_ZONES,
}: {
  value: string;
  onChange: (zoneId: string) => void;
  zones?: Zone[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] rounded-lg border-[#E8E2D8] bg-white text-sm font-medium text-[#1F2937]">
        <SelectValue placeholder="Toutes les zones" />
      </SelectTrigger>
      <SelectContent>
        {zones.map((zone) => (
          <SelectItem key={zone.id} value={zone.id}>
            {zone.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}