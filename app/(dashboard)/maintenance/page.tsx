"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import {
  api,
  MaintenanceIntervention,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
} from "@/services";

// Helpers
const getPriorityBadge = (priority?: MaintenancePriority) => {
  const currentPriority = priority ?? "moyenne";
  const colors = {
    haute: "bg-red-50 text-red-600 border-red-200",
    moyenne: "bg-orange-50 text-[#F2751F] border-orange-200",
    basse: "bg-stone-100 text-[#8A8478] border-stone-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", colors[currentPriority])}
    >
      {currentPriority}
    </Badge>
  );
};

const getStatusIcon = (status: MaintenanceStatus) => {
  switch (status) {
    case "en-cours":
    case "in-progress":
      return <Clock className="h-5 w-5 text-[#F2751F]" />;
    case "terminee":
    case "resolved":
    case "closed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "planifiee":
    case "open":
    default:
      return <Calendar className="h-5 w-5 text-[#F2751F]" />;
  }
};

const getTypeLabel = (type?: MaintenanceType): string => {
  if (!type) return "Intervention";
  const labels: Record<MaintenanceType, string> = {
    preventive: "Préventive",
    corrective: "Corrective",
    inspection: "Inspection",
    calibration: "Calibration",
  };
  return labels[type] ?? type;
};

export default function MaintenancePage() {
  const [activeFilter, setActiveFilter] = useState<string>("toutes");
  const [interventions, setInterventions] = useState<MaintenanceIntervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis NestJS
  useEffect(() => {
    async function fetchInterventions() {
      try {
        setLoading(true);
        const data = await api.getInterventions();
        setInterventions(data);
      } catch (err: any) {
        console.error("Erreur de chargement des interventions :", err);
        setError("Impossible de charger les données de maintenance.");
      } finally {
        setLoading(false);
      }
    }

    fetchInterventions();
  }, []);

  // Normalisation des statuts entre backend et frontend
  const isPlanifiee = (s: MaintenanceStatus) => s === "planifiee" || s === "open";
  const isEnCours = (s: MaintenanceStatus) => s === "en-cours" || s === "in-progress";
  const isTerminee = (s: MaintenanceStatus) => s === "terminee" || s === "resolved" || s === "closed";

  // Filtres dynamiques avec comptage exact
  const filters = [
    { id: "toutes", label: "Toutes", count: interventions.length },
    {
      id: "planifiees",
      label: "Planifiées",
      count: interventions.filter((i) => isPlanifiee(i.status)).length,
    },
    {
      id: "en-cours",
      label: "En cours",
      count: interventions.filter((i) => isEnCours(i.status)).length,
    },
    {
      id: "terminees",
      label: "Terminées",
      count: interventions.filter((i) => isTerminee(i.status)).length,
    },
  ];

  const filteredInterventions = interventions.filter((intervention) => {
    if (activeFilter === "toutes") return true;
    if (activeFilter === "planifiees") return isPlanifiee(intervention.status);
    if (activeFilter === "en-cours") return isEnCours(intervention.status);
    if (activeFilter === "terminees") return isTerminee(intervention.status);
    return true;
  });

  const handleStatusChange = async (
    interventionId: string,
    newStatus: MaintenanceStatus
  ) => {
    // 1. Mise à jour optimiste du state
    setInterventions((prev) =>
      prev.map((item) =>
        item.id === interventionId ? { ...item, status: newStatus } : item
      )
    );

    try {
      // 2. Persistance dans PostgreSQL via NestJS
      await api.updateIntervention(interventionId, { status: newStatus });
    } catch (err) {
      console.error(`Erreur lors du changement de statut pour #${interventionId}:`, err);
      const freshData = await api.getInterventions();
      setInterventions(freshData);
    }
  };

  const handleDelete = async (interventionId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette intervention ?")) return;

    setInterventions((prev) => prev.filter((i) => i.id !== interventionId));

    try {
      await api.deleteIntervention(interventionId);
    } catch (err) {
      console.error(`Erreur lors de la suppression #${interventionId}:`, err);
      const freshData = await api.getInterventions();
      setInterventions(freshData);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <PageHeader
        title="Planification maintenance"
        subtitle="Suivi des interventions de maintenance préventive et corrective"
        actions={
          <Button className="bg-[#F2751F] hover:bg-[#F2751F]/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle intervention
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "text-sm",
              activeFilter === filter.id
                ? "bg-[#F2751F] hover:bg-[#F2751F]/90 text-white"
                : "bg-white border-[#E8E2D8] text-[#8A8478] hover:bg-[#FAF7F2] hover:text-[#1F2937]"
            )}
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement du planning de maintenance...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : (
        /* Interventions List */
        <div className="space-y-4">
          {filteredInterventions.map((intervention) => {
            const title =
              intervention.title ??
              intervention.problem ??
              "Intervention technique";
            const location =
              intervention.location ??
              intervention.siteName ??
              intervention.site?.name ??
              "Site non spécifié";
            const formattedDate = intervention.plannedDate
              ? intervention.plannedDate
              : intervention.createdAt
              ? new Date(intervention.createdAt).toLocaleDateString("fr-FR")
              : "Non planifié";

            return (
              <div
                key={intervention.id}
                className="bg-white border border-[#E8E2D8] rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                        isEnCours(intervention.status)
                          ? "bg-orange-50"
                          : isTerminee(intervention.status)
                          ? "bg-green-50"
                          : "bg-amber-50"
                      )}
                    >
                      {getStatusIcon(intervention.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1F2937]">
                          {title}
                        </h3>
                        {getPriorityBadge(intervention.priority)}
                      </div>

                      <div className="text-sm text-[#8A8478] space-y-1">
                        <p>
                          • Localisation: <span className="text-[#1F2937] font-medium">{location}</span> | Type: <span className="text-[#1F2937] font-medium">{getTypeLabel(intervention.type)}</span> | Technicien: <span className="text-[#1F2937] font-medium">{intervention.technician || "Non assigné"}</span>
                        </p>
                        <p className="font-mono text-xs">
                          Planifié/Créé: {formattedDate}
                          {intervention.realizedDate && (
                            <span className="ml-2">
                              | Réalisé: {intervention.realizedDate}
                            </span>
                          )}
                        </p>
                        {(intervention.description || intervention.actions) && (
                          <p className="text-xs text-[#9A9284]">
                            {intervention.description || intervention.actions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={intervention.status}
                      onValueChange={(val: MaintenanceStatus) =>
                        handleStatusChange(intervention.id, val)
                      }
                    >
                      <SelectTrigger className="w-[140px] h-8 bg-[#FAF7F2] border-[#E8E2D8] text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planifiee">Planifiée</SelectItem>
                        <SelectItem value="en-cours">En cours</SelectItem>
                        <SelectItem value="terminee">Terminée</SelectItem>
                      </SelectContent>
                    </Select>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#8A8478] hover:text-[#1F2937]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(intervention.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredInterventions.length === 0 && (
            <div className="text-center py-12 bg-white border border-[#E8E2D8] rounded-xl">
              <AlertCircle className="h-12 w-12 text-[#B5AE9F] mx-auto mb-3" />
              <p className="text-[#8A8478] font-medium">
                Aucune intervention trouvée
              </p>
              <p className="text-sm text-[#9A9284] mt-1">
                Essayez de modifier vos filtres
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}