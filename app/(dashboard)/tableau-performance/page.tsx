// app/(dashboard)/tableau-performance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, PerformanceIndicator, PerformanceResponse } from "@/services";

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
}: PerformanceIndicator) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const getStatusColor = () => {
    if (progress >= 100) return "#16A34A";
    if (progress >= 50) return "#16A34A";
    if (progress >= 25) return "#F2751F";
    return "#16A34A";
  };

  const strokeColor = getStatusColor();

  return (
    <Card className="border-[#E8E2D8] flex flex-col items-center p-6">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#E8E2D8"
            strokeWidth="6"
          />
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono]">
            {value}
          </span>
          <span className="text-xs text-[#8A8478] mt-0.5">{unit}</span>
        </div>
      </div>

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
function ProgressBar({ indicator }: { indicator: PerformanceIndicator }) {
  const getStatusColor = () => {
    switch (indicator.status) {
      case "excellent":
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

      <div className="relative h-2 bg-[#E8E2D8] rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
            getStatusColor()
          )}
          style={{ width: `${Math.min(100, Math.max(0, indicator.progress))}%` }}
        />
      </div>
    </div>
  );
}

export default function PerformanceTablePage() {
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        setLoading(true);
        const res = await api.getPerformance();
        setData(res);
      } catch (err: any) {
        console.error("Erreur de chargement du tableau de performance :", err);
        setError("Impossible de charger les métriques de performance.");
      } finally {
        setLoading(false);
      }
    }

    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Tableau de performance"
          subtitle="Indicateurs clés vs objectifs annuels 2026"
        />
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement des performances réseau...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <PageHeader
          title="Tableau de performance"
          subtitle="Indicateurs clés vs objectifs annuels 2026"
        />
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error || "Données indisponibles"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Tableau de performance"
        subtitle="Indicateurs clés vs objectifs annuels 2026"
      />

      {/* Cartes circulaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {data.indicators?.map((indicator) => (
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
            {data.indicators?.map((indicator) => (
              <ProgressBar key={indicator.label} indicator={indicator} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cartes statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Coupures traitées */}
        <Card className="border-[#E8E2D8]">
          <CardContent className="p-6">
            <div className="text-xs text-[#8A8478] mb-2">
              COUPURES TRAITÉES (YTD)
            </div>
            <div className="text-2xl font-bold text-[#1F2937] font-[JetBrains Mono] mb-1">
              {data.ytdOutages ?? 0}
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
              {(data.totalMinutesClient ?? 0).toLocaleString("fr-FR")}
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
              {data.globalScore ?? 0}%
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