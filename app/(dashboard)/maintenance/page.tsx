// app/(dashboard)/maintenance/page.tsx
"use client";

import { useState } from "react";
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
  Wrench,
  MoreVertical,
  Pencil,
  Trash2,
  Plus
} from "lucide-react";

// Types
type MaintenancePriority = "haute" | "moyenne" | "basse";
type MaintenanceStatus = "planifiee" | "en-cours" | "terminee";
type MaintenanceType = "preventive" | "corrective" | "inspection" | "calibration";

interface MaintenanceIntervention {
  id: string;
  title: string;
  priority: MaintenancePriority;
  location: string;
  type: MaintenanceType;
  technician: string;
  plannedDate: string;
  realizedDate?: string;
  description: string;
  status: MaintenanceStatus;
}

// Mock data
const MOCK_INTERVENTIONS: MaintenanceIntervention[] = [
  {
    id: "1",
    title: "Remplacement disjoncteur défectueux",
    priority: "haute",
    location: "Poste Akwa",
    type: "corrective",
    technician: "Samuel Foka",
    plannedDate: "07/08/2026 16:34",
    description: "Maintenance corrective pour Poste Akwa",
    status: "en-cours",
  },
  {
    id: "2",
    title: "Inspection visuelle des isolateurs",
    priority: "basse",
    location: "Data Center Douala",
    type: "inspection",
    technician: "Jean-Marc Bidjocka",
    plannedDate: "05/08/2026 16:34",
    description: "Maintenance inspection pour Data Center Douala",
    status: "en-cours",
  },
  {
    id: "3",
    title: "Calibration des capteurs de tension",
    priority: "moyenne",
    location: "Poste Bafoussam",
    type: "calibration",
    technician: "Paul Etogo",
    plannedDate: "03/08/2026 16:34",
    description: "Maintenance calibration pour Poste Bafoussam",
    status: "en-cours",
  },
  {
    id: "4",
    title: "Inspection annuelle transformateur",
    priority: "moyenne",
    location: "Poste Centre-Yaoundé",
    type: "preventive",
    technician: "Jean-Marc Bidjocka",
    plannedDate: "28/07/2026 16:34",
    realizedDate: "29/07/2026",
    description: "Maintenance préventive pour Poste Centre-Yaoundé",
    status: "terminee",
  },
  {
    id: "5",
    title: "Vérification et serrage des connexions",
    priority: "basse",
    location: "Poste Hippodrome",
    type: "preventive",
    technician: "Paul Etogo",
    plannedDate: "13/07/2026 16:34",
    realizedDate: "14/07/2026",
    description: "Maintenance préventive pour Poste Hippodrome",
    status: "terminee",
  },
  {
    id: "6",
    title: "Test des protections différentielles",
    priority: "haute",
    location: "Centre Hospitalier Universitaire",
    type: "preventive",
    technician: "Abdoulaye Njoya",
    plannedDate: "28/06/2026 16:34",
    realizedDate: "29/06/2026",
    description: "Maintenance préventive pour Centre Hospitalier Universitaire",
    status: "terminee",
  },
  {
    id: "7",
    title: "Analyse d'huile du transformateur",
    priority: "moyenne",
    location: "Poste Bonanjo",
    type: "preventive",
    technician: "Marie Tchatcho",
    plannedDate: "13/06/2026 16:34",
    realizedDate: "14/06/2026",
    description: "Maintenance préventive pour Poste Bonanjo",
    status: "terminee",
  },
];

const FILTERS = [
  { id: "toutes", label: "Toutes", count: 15 },
  { id: "planifiees", label: "Planifiées", count: 8 },
  { id: "en-cours", label: "En cours", count: 3 },
  { id: "terminees", label: "Terminées", count: 4 },
] as const;

// Helpers
const getPriorityColor = (priority: MaintenancePriority): string => {
  switch (priority) {
    case "haute":
      return "text-red-600";
    case "moyenne":
      return "text-[#F2751F]";
    case "basse":
      return "text-[#8A8478]";
  }
};

const getPriorityBadge = (priority: MaintenancePriority) => {
  const colors = {
    haute: "bg-red-50 text-red-600 border-red-200",
    moyenne: "bg-orange-50 text-[#F2751F] border-orange-200",
    basse: "bg-stone-100 text-[#8A8478] border-stone-200",
  };

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", colors[priority])}>
      {priority}
    </Badge>
  );
};

const getStatusIcon = (status: MaintenanceStatus) => {
  switch (status) {
    case "en-cours":
      return <Clock className="h-5 w-5 text-[#F2751F]" />;
    case "terminee":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "planifiee":
      return <Calendar className="h-5 w-5 text-[#F2751F]" />;
  }
};

const getTypeLabel = (type: MaintenanceType): string => {
  const labels = {
    preventive: "Préventive",
    corrective: "Corrective",
    inspection: "Inspection",
    calibration: "Calibration",
  };
  return labels[type];
};

export default function MaintenancePage() {
  const [activeFilter, setActiveFilter] = useState<string>("toutes");
  const [interventions] = useState<MaintenanceIntervention[]>(MOCK_INTERVENTIONS);

  const filteredInterventions = interventions.filter((intervention) => {
    if (activeFilter === "toutes") return true;
    if (activeFilter === "planifiees") return intervention.status === "planifiee";
    if (activeFilter === "en-cours") return intervention.status === "en-cours";
    if (activeFilter === "terminees") return intervention.status === "terminee";
    return true;
  });

  return (
    <div className="space-y-6">
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
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "text-sm",
              activeFilter === filter.id
                ? "bg-[#F2751F] hover:bg-[#F2751F]/90"
                : "bg-white border-[#E8E2D8] text-[#8A8478] hover:bg-[#FAF7F2] hover:text-[#1F2937]"
            )}
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>

      {/* Interventions List */}
      <div className="space-y-4">
        {filteredInterventions.map((intervention) => (
          <div
            key={intervention.id}
            className="bg-white border border-[#E8E2D8] rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  intervention.status === "en-cours" ? "bg-orange-50" : "bg-green-50"
                )}>
                  {getStatusIcon(intervention.status)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1F2937]">
                      {intervention.title}
                    </h3>
                    {getPriorityBadge(intervention.priority)}
                  </div>

                  <div className="text-sm text-[#8A8478] space-y-1">
                    <p>
                      {intervention.location} • {getTypeLabel(intervention.type)} • {intervention.technician}
                    </p>
                    <p className="font-mono text-xs">
                      Planifié: {intervention.plannedDate}
                      {intervention.realizedDate && (
                        <span className="ml-2">• Réalisé: {intervention.realizedDate}</span>
                      )}
                    </p>
                    <p className="text-xs text-[#9A9284]">
                      {intervention.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={intervention.status}
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
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}

        {filteredInterventions.length === 0 && (
          <div className="text-center py-12 bg-white border border-[#E8E2D8] rounded-xl">
            <AlertCircle className="h-12 w-12 text-[#B5AE9F] mx-auto mb-3" />
            <p className="text-[#8A8478] font-medium">Aucune intervention trouvée</p>
            <p className="text-sm text-[#9A9284] mt-1">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}