"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  Wrench,
  ClipboardList,
  Package,
  BarChart3,
  Gauge,
  FileText,
  Bell,
  SlidersHorizontal,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: LayoutGrid },
  { label: "Sites", href: "/sites", icon: MapPin },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Interventions", href: "/interventions", icon: ClipboardList },
  { label: "Inventaire", href: "/inventaire", icon: Package },
  { label: "Stats zones", href: "/statistiques-zones", icon: BarChart3 },
  { label: "Performance", href: "/tableau-performance", icon: Gauge },
  { label: "Rapports", href: "/rapports", icon: FileText },
  { label: "Alertes", href: "/alertes", icon: Bell },
  { label: "Configuration", href: "/configuration-systeme", icon: SlidersHorizontal },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

export type SidebarUser = {
  email: string;
  role: "Administrateur" | "Technicien" | "Lecture ARSEL";
};

function formatDateHeure(date: Date) {
  const jour = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
  const jourMois = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);
  const heure = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${jour} ${jourMois} à ${heure}`.toUpperCase();
}

export function Sidebar({
  user,
  onLogout,
}: {
  user: SidebarUser;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const horodatage = formatDateHeure(new Date());

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[#E8E2D8] bg-[#FAF7F2]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2751F]">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-[#1F2937]">
            SOCADL
          </p>
          <p className="text-[10px] font-medium tracking-wide text-[#9A9284]">
            SUPERVISION RÉSEAU
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#FCE6D6] text-[#F2751F]"
                  : "text-[#6B6459] hover:bg-[#F0EBE2] hover:text-[#1F2937]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pied de sidebar */}
      <div className="border-t border-[#E8E2D8] px-4 py-4">
        <p className="mb-2 text-[10px] font-medium tracking-wide text-[#9A9284]">
          {horodatage}
        </p>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs text-[#6B6459]">{user.email}</p>
            <p className="text-xs font-semibold text-[#1F2937]">{user.role}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Se déconnecter"
            className="shrink-0 rounded-md p-1.5 text-[#9A9284] hover:bg-[#F0EBE2] hover:text-[#1F2937]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}