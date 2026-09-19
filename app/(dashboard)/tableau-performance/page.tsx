// app/(dashboard)/tableau-performance/page.tsx
"use client";

import { PageHeader } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PerformanceIndicator {
  label: string;
  value: number;
  unit: string;
  target: number;
  targetUnit: string;
  targetPrefix?: string;
  description: string;
  status: "excellent" | "good" | "warning";
  statusLabel: string;
  progress: number; // pourcentage 0-100
  isPercentage?: boolean; // si true, afficher en %
  inverseProgress?: boolean; // si true, moins c'est mieux (SAIDI, SAIFI)
}

// Données mockées
const PERFORMANCE_DATA: PerformanceIndicator[] = [
  {
    label: "SAIDI annuel",
    value: 60.3,
    unit: "min/abonné",
    target: 1200,
    targetUnit: "min/abonné",
    targetPrefix: "≤",
    description: "Durée cumulée de coupure par abonné",
    status: "excellent",
    statusLabel: "Excellent",
    progress: 5, // 60.3/1200 = 5%
    inverseProgress: true,
  },
  {
    label: "SAIFI annuel",
    value: 0.895,
    unit: "int./abonné",
    target: 10,
    targetUnit: "int./abonné",
    targetPrefix: "≤",
    description: "Fréquence des interruptions par abonné",
    status: "excellent",
    statusLabel: "Excellent",
    progress: 9, // 0.895/10 = 9%
    inverseProgress: true,
  },
  {
    label: "CAIDI",
    value: 67.4,
    unit: "min/int.",
    target: 120,
    targetUnit: "min/int.",
    targetPrefix: "≤",
    description: "Durée moyenne par interruption",
    status: "good",
    statusLabel: "Sur la bonne voie",
    progress: 56, // 67.4/120 = 56%
    inverseProgress: true,
  },
  {
    label: "Disponibilité",
    value: 99.989,
    unit: "%",
    target: 99.5,
    targetUnit: "%",
    targetPrefix: "≥",
    description: "Taux de disponibilité du réseau",
    status: "excellent",
    statusLabel: "Objectif atteint",
    progress: 100, // objectif dépassé
    isPercentage: true,
  },
];

// Cercle de progression
function CircularProgress({
  value,
  progress,
  label,
  unit,
  target,
  targetUnit,
  targetPrefix,
  description,
}: {
  value: number;
  progress: number;
  label: string;
  unit: string;
  target: number;
  targetUnit: string;
  targetPrefix?: string;
  description: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Couleur selon le statut
  const getStatusColor = () => {
    if (progress >= 100) return "#16A34A"; // vert
    if (progress >= 50) return "#16A34A"; // vert
    if (progress >= 25) return "#F2751F"; // orange
    return "#16A34A"; // vert (déjà excellent)
  };

  const strokeColor = getStatusColor();

  return (
    <Card className="border-[#E8E2D8] flex flex-col items-center p-6">
      {/* Cercle SVG */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          {/* Cercle de fond */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#E8E2D8"
            strokeWidth="6"
          />
          {/* Cercle de progression */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Valeur au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono]">
            {value}
          </span>
          <span className="text-xs text-[#8A8478] mt-0.5">{unit}</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-[#1F2937] mb-1">{label}</h3>
        <p className="text-xs text-[#8A8478] mb-1">{description}</p>
        <p className="text-xs text-[#8A8478] font-[JetBrains Mono]">
          Objectif: {targetPrefix} {target} {targetUnit}
        </p>
      </div>
    </Card>
  );
}

// Barre de progression horizontale
function ProgressBar({
  indicator,
}: {
  indicator: PerformanceIndicator;
}) {
  const getStatusColor = () => {
    switch (indicator.status) {
      case "excellent":
        return "bg-[#16A34A]";
      case "good":
        return "bg-[#16A34A]";
      case "warning":
        return "bg-[#F2751F]";
      default:
        return "bg-[#16A34A]";
    }
  };

  const getStatusIcon = () => {
    switch (indicator.status) {
      case "excellent":
        return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />;
      case "good":
        return <TrendingUp className="w-4 h-4 text-[#16A34A]" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-[#F2751F]" />;
    }
  };

  return (
    <div className="space-y-2">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1F2937]">
            {indicator.label}
          </span>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span
              className={cn(
                "text-xs",
                indicator.status === "warning"
                  ? "text-[#F2751F]"
                  : "text-[#16A34A]"
              )}
            >
              {indicator.statusLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A8478] font-[JetBrains Mono]">
            {indicator.value} / {indicator.target} {indicator.unit}
          </span>
          <span className="text-xs text-[#8A8478] font-[JetBrains Mono] w-12 text-right">
            {indicator.progress}%
          </span>
        </div>
      </div>

      {/* Barre */}
      <div className="relative h-2 bg-[#E8E2D8] rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
            getStatusColor()
          )}
          style={{ width: `${indicator.progress}%` }}
        />
      </div>
    </div>
  );
}

export default function PerformanceTablePage() {
  const ytdOutages = 9;
  const totalMinutesClient = 4751420;
  const globalScore = 75;

  return (
    <div className="p-6">
      <PageHeader
        title="Tableau de performance"
        subtitle="Indicateurs clés vs objectifs annuels 2026"
      />

      {/* 4 cartes circulaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {PERFORMANCE_DATA.map((indicator) => (
          <CircularProgress key={indicator.label} {...indicator} />
        ))}
      </div>

      {/* Progression vers les objectifs */}
      <Card className="border-[#E8E2D8] mb-6">
        <CardContent className="p-6">
          <h2 className="text-sm font-medium text-[#1F2937] mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F2751F]" />
            Progression vers les objectifs annuels
          </h2>

          <div className="space-y-6">
            {PERFORMANCE_DATA.map((indicator) => (
              <ProgressBar key={indicator.label} indicator={indicator} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3 cartes statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Coupures traitées */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">
              COUPURES TRAITÉES (YTD)
            </div>
            <div className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono] mb-1">
              {ytdOutages}
            </div>
            <div className="text-sm text-[#8A8478]">
              depuis le 01/01/2026
            </div>
          </CardContent>
        </Card>

        {/* Total minutes-client */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">
              TOTAL MINUTES-CLIENT
            </div>
            <div className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono] mb-1">
              {totalMinutesClient.toLocaleString("fr-FR")}
            </div>
            <div className="text-sm text-[#8A8478]">
              minutes de coupure cumulées
            </div>
          </CardContent>
        </Card>

        {/* Score global */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">
              SCORE GLOBAL
            </div>
            <div className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono] mb-1">
              {globalScore}%
            </div>
            <div className="text-sm text-[#8A8478]">
              objectifs atteints
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}