"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { PeriodFilter, type Period } from "@/components/dashboard/period-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FileDown, FileText, ArrowDown, Loader2 } from "lucide-react";
import { api, ZoneReport, EvolutionData } from "@/services";

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [zones, setZones] = useState<ZoneReport[]>([]);
  const [evolution, setEvolution] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recharger les données réelles à chaque changement de période ou de filtre
  useEffect(() => {
    async function fetchReportsData() {
      try {
        setLoading(true);
        const [zonesData, evolutionData] = await Promise.all([
          api.getZoneStats(period),
          api.getEvolutionData(period, zoneFilter === "all" ? undefined : zoneFilter),
        ]);

        setZones(zonesData ?? []);
        setEvolution(evolutionData ?? []);
      } catch (err: any) {
        console.error("Erreur de chargement des rapports :", err);
        setError("Impossible de charger les indicateurs IEEE 1366.");
      } finally {
        setLoading(false);
      }
    }

    fetchReportsData();
  }, [period, zoneFilter]);

  // Calculer les totaux/moyennes dynamiquement sur les données BDD
  const totalSAIDI = zones.reduce((sum, z) => sum + z.saidi, 0);
  const totalSAIFI = zones.reduce((sum, z) => sum + z.saifi, 0);
  const totalCAIDI = zones.length > 0 ? zones.reduce((sum, z) => sum + z.caidi, 0) / zones.length : 0;

  const handleExportCSV = () => {
    // Génération CSV à partir de `zones`
    const headers = "Zone,Sites,Abonnes,Coupures,SAIDI,SAIFI,CAIDI\n";
    const rows = zones
      .map(
        (z) =>
          `"${z.name}",${z.sites},${z.subscribers},${z.outages},${z.saidi},${z.saifi},${z.caidi}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rapport_ieee1366_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Rapports réglementaires"
        subtitle="Indicateurs IEEE 1366 — SAIDI / SAIFI / CAIDI"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="border-[#E8E2D8]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              className="bg-[#F2751F] hover:bg-[#F2751F]/90"
              onClick={handleExportPDF}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filtres */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <PeriodFilter value={period} onChange={setPeriod} />

        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Toutes les zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Calcul des indicateurs réglementaires...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : (
        <>
          {/* 3 cartes KPI */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="border-[#E8E2D8]">
              <CardContent className="p-6">
                <div className="text-xs text-[#8A8478] mb-2">SAIDI</div>
                <div className="text-3xl font-bold text-[#F2751F] font-[JetBrains Mono] mb-1">
                  {totalSAIDI.toFixed(2)}
                </div>
                <div className="text-sm text-[#8A8478]">min / abonné</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8E2D8]">
              <CardContent className="p-6">
                <div className="text-xs text-[#8A8478] mb-2">SAIFI</div>
                <div className="text-3xl font-bold text-[#F2751F] font-[JetBrains Mono] mb-1">
                  {totalSAIFI.toFixed(3)}
                </div>
                <div className="text-sm text-[#8A8478]">interruptions / abonné</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8E2D8]">
              <CardContent className="p-6">
                <div className="text-xs text-[#8A8478] mb-2">CAIDI</div>
                <div className="text-3xl font-bold text-[#F2751F] font-[JetBrains Mono] mb-1">
                  {totalCAIDI.toFixed(2)}
                </div>
                <div className="text-sm text-[#8A8478]">min / interruption</div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique d'évolution */}
          <Card className="border-[#E8E2D8] mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#1F2937] flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-[#8A8478]" />
                Évolution par période
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E8E2D8"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#9A9284"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9A9284"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E8E2D8",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="saidi"
                      stroke="#F2751F"
                      strokeWidth={2}
                      dot={false}
                      name="SAIDI (min)"
                    />
                    <Line
                      type="monotone"
                      dataKey="saifi"
                      stroke="#16A34A"
                      strokeWidth={2}
                      dot={false}
                      name="SAIFI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tableau de comparaison */}
          <Card className="border-[#E8E2D8]">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#1F2937] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8A8478]" />
                Comparaison par zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAF7F2] border-[#E8E2D8]">
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
                      SAIDI (MIN){" "}
                      <ArrowDown className="w-3 h-3 inline ml-1" />
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      SAIFI
                    </TableHead>
                    <TableHead className="text-[#8A8478] font-medium text-right">
                      CAIDI (MIN)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id} className="border-[#E8E2D8]">
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