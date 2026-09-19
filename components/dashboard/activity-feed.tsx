import { Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityEvent = {
  id: string;
  label: string;
  site: string;
  timestamp: string; // déjà formaté, ex: "il y a 12 min"
  severity: "info" | "warning" | "critical";
};

const SEVERITY_DOT: Record<ActivityEvent["severity"], string> = {
  info: "bg-[#8A8478]",
  warning: "bg-[#F2751F]",
  critical: "bg-[#DC2626]",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#8A8478]" />
        <p className="text-sm font-semibold text-[#1F2937]">Flux d'activité</p>
      </div>

      {events.length === 0 ? (
        <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-[#B5AE9F]">
          <Clock className="h-6 w-6" />
          <p className="text-sm">Aucun événement récent</p>
        </div>
      ) : (
        <ul className="max-h-[220px] space-y-3 overflow-y-auto">
          {events.map((event) => (
            <li key={event.id} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  SEVERITY_DOT[event.severity]
                )}
              />
              <div className="min-w-0">
                <p className="truncate text-sm text-[#1F2937]">{event.label}</p>
                <p className="text-xs text-[#9A9284]">
                  {event.site} · {event.timestamp}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}