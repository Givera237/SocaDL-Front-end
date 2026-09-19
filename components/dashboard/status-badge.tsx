// Destination dans le projet : components/dashboard/status-badge.tsx
// Remplit le stub vide existant. Réutilisé par la page Sites (et, plus tard,
// par toute autre page affichant un statut : Maintenance, Alertes, etc.)

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SiteStatus = "online" | "offline" | "warning";

const STATUS_CONFIG: Record<
  SiteStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  online: {
    label: "En ligne",
    icon: CheckCircle2,
    className: "bg-[#16A34A]/10 text-[#16A34A]",
  },
  offline: {
    label: "En panne",
    icon: AlertTriangle,
    className: "bg-[#DC2626]/10 text-[#DC2626]",
  },
  warning: {
    label: "Avertissement",
    icon: AlertCircle,
    className: "bg-[#F2751F]/10 text-[#F2751F]",
  },
};

interface StatusBadgeProps {
  status: SiteStatus;
  /** Libellé optionnel pour remplacer le libellé par défaut du statut. */
  label?: string;
  className?: string;
}

// Design system SOCADL §2 : un statut ne repose jamais uniquement sur la
// couleur — l'icône porte l'information au même titre que la teinte.
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label ?? config.label}
    </span>
  );
}