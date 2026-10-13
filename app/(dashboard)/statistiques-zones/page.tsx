// app/(dashboard)/statistiques-zones/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { PeriodFilter, type Period } from "@/components/dashboard/period-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, ZoneStats } from "@/services";

export default function ZoneStatisticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [zones, setZones] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les statistiques des zones depuis le backend NestJS
  useEffect(() => {
    async function fetchZoneStats() {
      try {
        setLoading(true);
        const data = await api.getZoneStats(period);
        setZones(data ?? []);
      } catch (err: any) {
        console.error("Erreur de chargement des statistiques de zones :", err);
        setError("Impossible de charger les statistiques de zones.");
      } finally {
        setLoading(false);
      }
    }

    fetchZoneStats();
  }, [period]);

  // Tri pour identifier la zone la plus faible (plus haut SAIDI) et la meilleure (plus bas SAIDI)
  const sortedBySAIDI = [...zones].sort((a, b) => b.saidi - a.saidi);
  const weakestZone = sortedBySAIDI[0];
  const bestZone = sortedBySAIDI[zones.length - 1];

  // Calculer la moyenne réseau
  const avgSAIDI = zones.length
    ? zones.reduce((sum, z) => sum + z.saidi, 0) / zones.length
    : 0;
  const avgSAIFI = zones.length
    ? zones.reduce((sum, z) => sum + z.saifi, 0) / zones.length
    : 0;

  // Valeur maximale dynamique pour l'échelle des barres
  const maxSAIDI = Math.max(...zones.map((z) => z.saidi), 1);
  const maxSAIFI = Math.max(...zones.map((z) => z.saifi), 0.1);

  return (
    <div className="p-6">
      <PageHeader
        title="Statistiques comparatives"
        subtitle="Analyse des performances par district pour identifier les points faibles"
      />

      {/* Filtres de période */}
      <div className="mb-6">
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Calcul des statistiques de zone...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : zones.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#E8E2D8] rounded-xl text-[#8A8478]">
          Aucune donnée disponible pour la période sélectionnée.
        </div>
      ) : (
        <>
          {/* Cartes KPI */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {/* Zone la plus faible */}
            <Card className="border-[#E8E2D8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-[#8A8478] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  ZONE LA PLUS FAIBLE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1F2937] mb-1">
                  {weakestZone?.name ?? "N/A"}
                </div>
                <p className="text-sm text-[#8A8478] font-[JetBrains Mono]">
                  SAIDI: {weakestZone?.saidi.toFixed(2) ?? "0.00"} min/abonné
                </p>
              </CardContent>
            </Card>

            {/* Meilleure zone */}
            <Card className="border-[#E8E2D8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-[#8A8478] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  MEILLEURE ZONE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1F2937] mb-1">
                  {bestZone?.name ?? "N/A"}
                </div>
                <p className="text-sm text-[#8A8478] font-[JetBrains Mono]">
                  SAIDI: {bestZone?.saidi.toFixed(2) ?? "0.00"} min/abonné
                </p>
              </CardContent>
            </Card>

            {/* Moyenne réseau */}
            <Card className="border-[#E8E2D8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-[#8A8478] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F2751F]" />
                  MOYENNE RÉSEAU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1F2937] mb-1 font-[JetBrains Mono]">
                  {avgSAIDI.toFixed(2)} min
                </div>
                <p className="text-sm text-[#8A8478] font-[JetBrains Mono]">
                  SAIFI moyen: {avgSAIFI.toFixed(3)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques à barres */}
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            {/* SAIDI par zone */}
            <Card className="border-[#E8E2D8]">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-[#1F2937]">
                  SAIDI par zone (min/abonné)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zones.map((zone) => {
                    const percentage = Math.min(
                      100,
                      (zone.saidi / maxSAIDI) * 100
                    );
                    return (
                      <div key={zone.id} className="flex items-center gap-4">
                        <div className="w-28 text-sm text-[#8A8478] text-right truncate">
                          {zone.name}
                        </div>
                        <div className="flex-1 h-8 bg-[#FAF7F2] rounded-md relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-[#F2751F] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-[#8A8478] font-[JetBrains Mono]">
                          {zone.saidi.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-[#9A9284]">
                  <span>0</span>
                  <span>{(maxSAIDI * 0.25).toFixed(1)}</span>
                  <span>{(maxSAIDI * 0.5).toFixed(1)}</span>
                  <span>{(maxSAIDI * 0.75).toFixed(1)}</span>
                  <span>{maxSAIDI.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            {/* SAIFI par zone */}
            <Card className="border-[#E8E2D8]">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-[#1F2937]">
                  SAIFI par zone (interruptions/abonné)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zones.map((zone) => {
                    const percentage = Math.min(
                      100,
                      (zone.saifi / maxSAIFI) * 100
                    );
                    return (
                      <div key={zone.id} className="flex items-center gap-4">
                        <div className="w-28 text-sm text-[#8A8478] text-right truncate">
                          {zone.name}
                        </div>
                        <div className="flex-1 h-8 bg-[#FAF7F2] rounded-md relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-[#F2751F] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-[#8A8478] font-[JetBrains Mono]">
                          {zone.saifi.toFixed(3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-[#9A9284]">
                  <span>0</span>
                  <span>{(maxSAIFI * 0.25).toFixed(2)}</span>
                  <span>{(maxSAIFI * 0.5).toFixed(2)}</span>
                  <span>{(maxSAIFI * 0.75).toFixed(2)}</span>
                  <span>{maxSAIFI.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableau détaillé */}
          <Card className="border-[#E8E2D8]">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#1F2937]">
                Classement détaillé par zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAF7F2] border-[#E8E2D8]">
                    <TableHead className="text-[#8A8478] font-medium">
                      RANG
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium">
                      ZONE
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      SITES
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      ABONNÉS
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      COUPURES
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      SAIDI
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      SAIFI
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      CAIDI
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBySAIDI.map((zone, index) => (
                    <TableRow
                      key={zone.id}
                      className={cn(
                        "border-[#E8E2D8]",
                        index === 0 && zone.saidi > 0 && "bg-[#FDF2F0]"
                      )}
                    >
                      <TableCell className="font-medium">
                        <span
                          className={cn(
                            "text-sm",
                            index === 0 && zone.saidi > 0 && "text-[#DC2626]"
                          )}
                        >
                          #{index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-[#1F2937]">
                        {zone.name}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.sites}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.subscribers.toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.outages}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.saidi.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.saifi.toFixed(3)}
                      </TableCell>
                      <TableCell className="text-right font-[JetBrains Mono] text-sm text-[#1F2937]">
                        {zone.caidi.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}