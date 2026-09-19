// app/(dashboard)/rapports/page.tsx
"use client";

import { useState } from "react";
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
import { FileDown, FileText, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ZoneReport {
  id: string;
  name: string;
  sites: number;
  subscribers: number;
  outages: number;
  saidi: number;
  saifi: number;
  caidi: number;
}

interface EvolutionData {
  date: string;
  saidi: number;
  saifi: number;
}

// Données mockées
const MOCK_ZONES: ZoneReport[] = [
  {
    id: "1",
    name: "Adamaoua",
    sites: 1,
    subscribers: 4100,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "2",
    name: "Extrême-Nord",
    sites: 1,
    subscribers: 3800,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "3",
    name: "Sud",
    sites: 1,
    subscribers: 3100,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "4",
    name: "Yaoundé",
    sites: 3,
    subscribers: 22800,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "5",
    name: "Nord",
    sites: 1,
    subscribers: 4300,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "6",
    name: "Douala",
    sites: 3,
    subscribers: 29000,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "7",
    name: "Nord-Ouest",
    sites: 1,
    subscribers: 5200,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
  {
    id: "8",
    name: "Ouest",
    sites: 1,
    subscribers: 6500,
    outages: 0,
    saidi: 0.0,
    saifi: 0.0,
    caidi: 0.0,
  },
];

// Données d'évolution mockées (30 jours)
const MOCK_EVOLUTION: EvolutionData[] = [
  { date: "20/08", saidi: 0.0, saifi: 0.0 },
  { date: "22/08", saidi: 0.0, saifi: 0.0 },
  { date: "24/08", saidi: 0.0, saifi: 0.0 },
  { date: "26/08", saidi: 0.0, saifi: 0.0 },
  { date: "28/08", saidi: 0.0, saifi: 0.0 },
  { date: "30/08", saidi: 0.0, saifi: 0.0 },
  { date: "01/09", saidi: 0.0, saifi: 0.0 },
  { date: "03/09", saidi: 0.0, saifi: 0.0 },
  { date: "05/09", saidi: 0.0, saifi: 0.0 },
  { date: "07/09", saidi: 0.0, saifi: 0.0 },
  { date: "09/09", saidi: 0.0, saifi: 0.0 },
  { date: "11/09", saidi: 0.0, saifi: 0.0 },
  { date: "13/09", saidi: 0.0, saifi: 0.0 },
  { date: "15/09", saidi: 0.0, saifi: 0.0 },
  { date: "17/09", saidi: 0.0, saifi: 0.0 },
  { date: "19/09", saidi: 0.0, saifi: 0.0 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [zones] = useState<ZoneReport[]>(MOCK_ZONES);
  const [evolution] = useState<EvolutionData[]>(MOCK_EVOLUTION);

  // Calculer les totaux/moyennes
  const totalSAIDI = zones.reduce((sum, z) => sum + z.saidi, 0);
  const totalSAIFI = zones.reduce((sum, z) => sum + z.saifi, 0);
  const totalCAIDI = zones.reduce((sum, z) => sum + z.caidi, 0);

  const handleExportCSV = () => {
    // TODO: Implémenter l'export CSV
    console.log("Export CSV clicked");
  };

  const handleExportPDF = () => {
    // TODO: Implémenter l'export PDF
    console.log("Export PDF clicked");
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
      <div className="mb-6 flex items-center gap-4">
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

      {/* 3 cartes KPI */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* SAIDI */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">SAIDI</div>
            <div className="text-3xl font-bold text-[#F2751F] font-[JetBrains Mono] mb-1">
              {totalSAIDI.toFixed(2)}
            </div>
            <div className="text-sm text-[#8A8478]">min / abonné</div>
          </CardContent>
        </Card>

        {/* SAIFI */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">SAIFI</div>
            <div className="text-3xl font-bold text-[#F2751F] font-[JetBrains Mono] mb-1">
              {totalSAIFI.toFixed(3)}
            </div>
            <div className="text-sm text-[#8A8478]">interruptions / abonné</div>
          </CardContent>
        </Card>

        {/* CAIDI */}
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
                  domain={[0, 4]}
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
    </div>
  );
}