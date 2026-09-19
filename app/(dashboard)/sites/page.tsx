// Destination dans le projet : app/(dashboard)/sites/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

import { PageHeader } from "@/components/layout/header";
import { StatusBadge, type SiteStatus } from "@/components/dashboard/status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO(api): remplacer par un appel réel (ex: GET /api/sites) une fois le
// branchement API effectué. Structure calquée sur celle utilisée pour
// MOCK_SITES / MOCK_EVENTS / MOCK_TREND dans le Tableau de bord.
interface SiteRow {
  id: string;
  name: string;
  code: string;
  zone: string;
  subscribers: number;
  tensionV: number;
  frequencyHz: number;
  status: SiteStatus;
  lastCommDays: number;
}

const MOCK_SITES: SiteRow[] = [
  { id: "1", name: "Poste Ngaoundéré", code: "NGR-CTR-01", zone: "Adamaoua", subscribers: 4100, tensionV: 199.3, frequencyHz: 49.78, status: "offline", lastCommDays: 41 },
  { id: "2", name: "Poste Maroua", code: "MRA-CTR-01", zone: "Extrême-Nord", subscribers: 3800, tensionV: 229.2, frequencyHz: 50.06, status: "offline", lastCommDays: 41 },
  { id: "3", name: "Poste Kribi", code: "KRB-CTR-01", zone: "Sud", subscribers: 3100, tensionV: 231.9, frequencyHz: 50.01, status: "offline", lastCommDays: 41 },
  { id: "4", name: "Poste Hippodrome", code: "YDE-HIP-02", zone: "Yaoundé", subscribers: 8200, tensionV: 228.9, frequencyHz: 50.01, status: "offline", lastCommDays: 41 },
  { id: "5", name: "Poste Garoua", code: "GAR-CTR-01", zone: "Nord", subscribers: 4300, tensionV: 230.3, frequencyHz: 50.06, status: "offline", lastCommDays: 41 },
  { id: "6", name: "Poste Centre-Yaoundé", code: "YDE-CTR-01", zone: "Yaoundé", subscribers: 12500, tensionV: 233.5, frequencyHz: 50.04, status: "offline", lastCommDays: 41 },
  { id: "7", name: "Poste Bonanjo", code: "DLA-BNJ-01", zone: "Douala", subscribers: 18000, tensionV: 234.4, frequencyHz: 50.08, status: "offline", lastCommDays: 41 },
  { id: "8", name: "Poste Bamenda", code: "BDA-CTR-01", zone: "Nord-Ouest", subscribers: 5200, tensionV: 227.4, frequencyHz: 50.07, status: "offline", lastCommDays: 41 },
  { id: "9", name: "Poste Bafoussam", code: "BFO-CTR-01", zone: "Ouest", subscribers: 6500, tensionV: 225.8, frequencyHz: 49.96, status: "offline", lastCommDays: 41 },
  { id: "10", name: "Poste Akwa", code: "DLA-AKW-02", zone: "Douala", subscribers: 9500, tensionV: 200.9, frequencyHz: 49.77, status: "offline", lastCommDays: 41 },
  { id: "11", name: "Data Center Douala", code: "DLA-DC-01", zone: "Douala", subscribers: 1500, tensionV: 232.7, frequencyHz: 50.03, status: "offline", lastCommDays: 41 },
  // La capture d'écran mentionne 12 sites mais le 12e est tronqué en bas de
  // liste (visible : "Centre Hospitalier Universit...") — à compléter avec
  // les données réelles lors du branchement API.
];

const TOTAL_SITES_LABEL = "12 sites supervisés sur le territoire";

const STATUS_OPTIONS: Array<{ value: "all" | SiteStatus; label: string }> = [
  { value: "all", label: "Tous les statuts" },
  { value: "online", label: "En ligne" },
  { value: "offline", label: "En panne" },
  { value: "warning", label: "Avertissement" },
];

const numberFormatter = new Intl.NumberFormat("fr-FR");

export default function SitesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SiteStatus>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  const zones = useMemo(
    () => Array.from(new Set(MOCK_SITES.map((site) => site.zone))).sort(),
    []
  );

  const filteredSites = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_SITES.filter((site) => {
      const matchesQuery =
        query.length === 0 ||
        site.name.toLowerCase().includes(query) ||
        site.code.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || site.status === statusFilter;
      const matchesZone = zoneFilter === "all" || site.zone === zoneFilter;
      return matchesQuery && matchesStatus && matchesZone;
    });
  }, [search, statusFilter, zoneFilter]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sites" subtitle={TOTAL_SITES_LABEL} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B5AE9F]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un site..."
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | SiteStatus)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* TODO(api): les zones viendront de l'API plutôt que d'être déduites
            du mock. La ZoneSelector existante ne couvre que 5 zones fixes
            (Yaoundé, Douala, Bamenda, Garoua, Ébolowa) — à généraliser pour
            accepter une liste dynamique avant de la réutiliser ici. */}
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8E2D8] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-[#E8E2D8] hover:bg-transparent">
              <TableHead className="text-[#8A8478]">Site</TableHead>
              <TableHead className="text-[#8A8478]">Zone</TableHead>
              <TableHead className="text-right text-[#8A8478]">Abonnés</TableHead>
              <TableHead className="text-right text-[#8A8478]">Tension</TableHead>
              <TableHead className="text-right text-[#8A8478]">Fréq.</TableHead>
              <TableHead className="text-[#8A8478]">Statut</TableHead>
              <TableHead className="text-[#8A8478]">Dernière comm.</TableHead>
              <TableHead className="text-right text-[#8A8478]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSites.map((site) => (
              <TableRow key={site.id} className="border-[#E8E2D8]">
                <TableCell>
                  <div className="font-medium text-[#1F2937]">{site.name}</div>
                  <div className="font-mono text-xs text-[#9A9284]">{site.code}</div>
                </TableCell>
                <TableCell className="text-[#1F2937]">{site.zone}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                  {numberFormatter.format(site.subscribers)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                  {site.tensionV.toFixed(1)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                  {site.frequencyHz.toFixed(2)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={site.status} />
                </TableCell>
                <TableCell className="text-[#8A8478]">il y a {site.lastCommDays} j</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/sites/${site.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#F2751F] hover:underline"
                  >
                    Détails
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {filteredSites.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-[#9A9284]">
                  Aucun site ne correspond à cette recherche.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}