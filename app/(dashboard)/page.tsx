"use client";

import { useState } from "react";
import { Clock, Activity, TrendingUp, Zap, AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/layout/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MinMaxCard } from "@/components/dashboard/min-max-card";
import { PeriodFilter, type Period } from "@/components/dashboard/period-filter";
import { ZoneSelector } from "@/components/dashboard/zone-selector";
import { SiteMap, type Site } from "@/components/dashboard/site-map";
import { ActivityFeed, type ActivityEvent } from "@/components/dashboard/activity-feed";
import { TrendChart, type TrendPoint } from "@/components/dashboard/trend-chart";

// TODO: remplacer par les données réelles issues de l'API une fois l'intégration branchée
const MOCK_SITES: Site[] = [
  { id: "yaounde", name: "Yaoundé", lat: 3.848, lng: 11.502, status: "online", weight: 12 },
  { id: "douala", name: "Douala", lat: 4.0511, lng: 9.7679, status: "online", weight: 14 },
  { id: "bamenda", name: "Bamenda", lat: 5.9631, lng: 10.1591, status: "online", weight: 9 },
  { id: "bamenda-2", name: "Bamenda — Poste 2", lat: 5.92, lng: 10.16, status: "online", weight: 7 },
  { id: "garoua", name: "Garoua", lat: 9.3017, lng: 13.3921, status: "online", weight: 10 },
  { id: "ebolowa", name: "Ébolowa", lat: 2.9, lng: 11.15, status: "online", weight: 8 },
  { id: "bertoua", name: "Bertoua", lat: 6.5, lng: 13.68, status: "online", weight: 6 },
];

const MOCK_EVENTS: ActivityEvent[] = [];
const MOCK_TREND: TrendPoint[] = [];

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [zone, setZone] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Supervision en temps réel du réseau électrique"
        actions={
          <>
            <PeriodFilter value={period} onChange={setPeriod} />
            <ZoneSelector value={zone} onChange={setZone} />
          </>
        }
      />

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="SAIDI (DEPUIS LE 1ER JA...)"
          value="60.3 min/ab."
          caption="Cumul annuel IEEE 1366"
          icon={Clock}
          tone="orange"
        />
        <KpiCard
          label="DERNIÈRE COUPURE"
          value="En cours"
          caption="Temps écoulé territoire"
          icon={Activity}
          tone="red"
        />
        <KpiCard
          label="SAIFI CUMULÉ"
          value="0.89"
          caption="Depuis le 1er janvier"
          icon={TrendingUp}
          tone="orange"
        />
        <KpiCard
          label="SITES EN LIGNE"
          value="0/12"
          caption="12 hors ligne"
          icon={Zap}
          tone="orange"
        />
        <KpiCard
          label="INCIDENTS ACTIFS"
          value="0"
          caption="Non résolus"
          icon={AlertTriangle}
          tone="green"
        />
      </div>

      {/* Carte + mesures instantanées */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <SiteMap sites={MOCK_SITES} />
        <div className="grid grid-cols-2 gap-4">
          <MinMaxCard label="TENSION" unit="V" />
          <MinMaxCard label="FRÉQUENCE" unit="Hz" />
          <MinMaxCard label="PUISSANCE ACTIVE" unit="kW" />
          <MinMaxCard label="FACTEUR DE PUISSANCE" />
        </div>
      </div>

      {/* Flux d'activité + tendance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityFeed events={MOCK_EVENTS} />
        <TrendChart data={MOCK_TREND} />
      </div>
    </div>
  );
}