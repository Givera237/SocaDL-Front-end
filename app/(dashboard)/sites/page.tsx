// app/(dashboard)/sites/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Search, Loader2 } from "lucide-react";

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
import { api, SiteRow } from "@/services";

const STATUS_OPTIONS: Array<{ value: "all" | SiteStatus; label: string }> = [
  { value: "all", label: "Tous les statuts" },
  { value: "online", label: "En ligne" },
  { value: "offline", label: "En panne" },
  { value: "warning", label: "Avertissement" },
  { value: "maintenance", label: "En maintenance" },
];

const numberFormatter = new Intl.NumberFormat("fr-FR");

export default function SitesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SiteStatus>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données des sites depuis NestJS / PostgreSQL
  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const data = await api.getSites();
        setSites(data);
      } catch (err: any) {
        console.error("Erreur de chargement des sites :", err);
        setError("Impossible de charger la liste des sites.");
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  // Extraction dynamique des zones uniques reçues de l'API BDD
  const zones = useMemo(
    () => Array.from(new Set(sites.map((site) => site.zone).filter(Boolean))).sort(),
    [sites]
  );

  // Filtrage des sites sur les données BDD
  const filteredSites = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sites.filter((site) => {
      const matchesQuery =
        query.length === 0 ||
        site.name.toLowerCase().includes(query) ||
        site.code.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || site.status === statusFilter;
      const matchesZone = zoneFilter === "all" || site.zone === zoneFilter;
      return matchesQuery && matchesStatus && matchesZone;
    });
  }, [search, statusFilter, zoneFilter, sites]);

  const totalSitesLabel = `${sites.length} site(s) supervisé(s) sur le territoire`;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Sites" subtitle={totalSitesLabel} />

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

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement des sites supervisés...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : (
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
                  <TableCell className="text-[#1F2937]">{site.zone || "N/A"}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                    {numberFormatter.format(site.subscribers || 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                    {site.tensionV ? site.tensionV.toFixed(1) : "0.0"} V
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#1F2937]">
                    {site.frequencyHz ? site.frequencyHz.toFixed(2) : "0.00"} Hz
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={site.status} />
                  </TableCell>
                  <TableCell className="text-[#8A8478]">
                    {site.lastCommDays !== undefined ? `il y a ${site.lastCommDays} j` : "Inconnu"}
                  </TableCell>
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
      )}
    </div>
  );
}