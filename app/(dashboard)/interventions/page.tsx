// app/(dashboard)/fiches-interventions/page.tsx
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
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

// Types
type InterventionStatus = "open" | "in-progress" | "resolved" | "closed";

interface InterventionTicket {
  id: string;
  siteName: string;
  eventDate: string;
  createdAt: string;
  technician: string;
  problem: string;
  actions?: string;
  parts?: string;
  status: InterventionStatus;
  duration: string;
}

// Données mockées
const MOCK_TICKETS: InterventionTicket[] = [
  {
    id: "1",
    siteName: "Poste Centre-Yaoundé",
    eventDate: "04/08/2026",
    createdAt: "07/08/2026 16:34",
    technician: "Jean-Marc Bidjocka",
    problem: "Coupure d'alimentation sur le transformateur principal",
    status: "open",
    duration: "0 min",
  },
  {
    id: "2",
    siteName: "Poste Bonanjo",
    eventDate: "02/08/2026",
    createdAt: "06/08/2026 16:34",
    technician: "Marie Tchatcho",
    problem: "Perte de communication avec le site",
    status: "in-progress",
    duration: "0 min",
  },
  {
    id: "3",
    siteName: "Poste Hippodrome",
    eventDate: "03/08/2026",
    createdAt: "06/08/2026 16:34",
    technician: "Paul Etogo",
    problem: "Tension anormalement basse signalée par les capteurs",
    status: "open",
    duration: "0 min",
  },
  {
    id: "4",
    siteName: "Poste Akwa",
    eventDate: "07/08/2026",
    createdAt: "05/08/2026 16:34",
    technician: "Samuel Foka",
    problem: "Surtension transitoire enregistrée",
    status: "in-progress",
    duration: "0 min",
  },
  {
    id: "5",
    siteName: "Centre Hospitalier Universitaire",
    eventDate: "05/08/2026",
    createdAt: "05/08/2026 16:34",
    technician: "Abdoulaye Njoya",
    problem: "Disjoncteur déclenché suite à surcharge",
    status: "open",
    duration: "0 min",
  },
  {
    id: "6",
    siteName: "Data Center Douala",
    eventDate: "19/04/2026",
    createdAt: "04/08/2026 16:34",
    technician: "Jean-Marc Bidjocka",
    problem: "Batterie de secours déchargée",
    status: "in-progress",
    duration: "0 min",
  },
  {
    id: "7",
    siteName: "Poste Bafoussam",
    eventDate: "05/08/2026",
    createdAt: "02/08/2026 16:34",
    technician: "Paul Etogo",
    problem: "Défaut d'isolement sur ligne HT",
    actions: "Isolation du défaut, réparation du câble, test d'isolement",
    parts: "Carte électronique de contrôle",
    status: "resolved",
    duration: "2h 10min",
  },
  {
    id: "8",
    siteName: "Poste Maroua",
    eventDate: "30/07/2026",
    createdAt: "30/07/2026 16:34",
    technician: "Samuel Foka",
    problem: "Disjoncteur déclenché suite à surcharge",
    actions: "Isolation du défaut, réparation du câble, test d'isolement",
    parts: "Carte électronique de contrôle",
    status: "resolved",
    duration: "2h 28min",
  },
  {
    id: "9",
    siteName: "Poste Kribi",
    eventDate: "29/07/2026",
    createdAt: "29/07/2026 16:34",
    technician: "Jean-Marc Bidjocka",
    problem: "Perte de communication avec le site",
    actions: "Diagnostic complet du tableau, remplacement du composant défectueux",
    parts: "Relais de protection",
    status: "resolved",
    duration: "3h 29min",
  },
  {
    id: "10",
    siteName: "Poste Ngaoundéré",
    eventDate: "28/07/2026",
    createdAt: "28/07/2026 16:34",
    technician: "Paul Etogo",
    problem: "Surtension transitoire enregistrée",
    actions: "Vérification des connexions, resserrage des bornes, test de mise sous tension",
    parts: "Batterie 12V 100Ah",
    status: "closed",
    duration: "2h 35min",
  },
  {
    id: "11",
    siteName: "Poste Centre-Yaoundé",
    eventDate: "25/07/2026",
    createdAt: "25/07/2026 16:34",
    technician: "Abdoulaye Njoya",
    problem: "Batterie de secours déchargée",
    actions: "Réinitialisation des protections, calibrage des relais, remise en service",
    parts: "Câble 16mm²",
    status: "closed",
    duration: "2h 59min",
  },
  {
    id: "12",
    siteName: "Poste Hippodrome",
    eventDate: "22/07/2026",
    createdAt: "22/07/2026 16:34",
    technician: "Marie Tchatcho",
    problem: "Défaut d'isolement sur ligne HT",
    actions: "Remplacement de la carte de communication, reconfiguration des paramètres",
    parts: "Aucune pièce remplacée",
    status: "closed",
    duration: "1h 12min",
  },
];

export default function InterventionTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | InterventionStatus>("all");
  const [tickets, setTickets] = useState<InterventionTicket[]>(MOCK_TICKETS);

  const getStatusLabel = (status: InterventionStatus) => {
    switch (status) {
      case "open":
        return "Ouverte";
      case "in-progress":
        return "En cours";
      case "resolved":
        return "Résolue";
      case "closed":
        return "Clôturée";
    }
  };

  const getStatusColor = (status: InterventionStatus) => {
    switch (status) {
      case "open":
        return "bg-[#FEF3C7] text-[#F2751F]";
      case "in-progress":
        return "bg-[#FFEDD5] text-[#F2751F]";
      case "resolved":
        return "bg-[#D1FAE5] text-[#16A34A]";
      case "closed":
        return "bg-[#F3F4F6] text-[#8A8478]";
    }
  };

  const getIconBg = (status: InterventionStatus) => {
    switch (status) {
      case "open":
        return "bg-[#FEF3C7]";
      case "in-progress":
        return "bg-[#FFEDD5]";
      case "resolved":
        return "bg-[#D1FAE5]";
      case "closed":
        return "bg-[#F3F4F6]";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter === "all") return true;
    return ticket.status === statusFilter;
  });

  const handleStatusChange = (ticketId: string, newStatus: InterventionStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  const renderTicket = (ticket: InterventionTicket) => {
    return (
      <div
        key={ticket.id}
        className="bg-white border border-[#E8E2D8] rounded-xl p-5 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start gap-4">
          {/* Icône de statut */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBg(
              ticket.status
            )}`}
          >
            {ticket.status === "resolved" || ticket.status === "closed" ? (
              <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#F2751F]" />
            )}
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* En-tête de la carte */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#1F2937]">{ticket.siteName}</h3>
                  <span className="px-2 py-0.5 bg-[#E8E2D8] rounded text-xs text-[#8A8478]">
                    Évt: {ticket.eventDate}
                  </span>
                </div>
                <p className="text-sm text-[#8A8478]">
                  {ticket.technician} • {ticket.createdAt} • {ticket.duration}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Select
                  value={ticket.status}
                  onValueChange={(value: InterventionStatus) =>
                    handleStatusChange(ticket.id, value)
                  }
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Ouverte</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolue</SelectItem>
                    <SelectItem value="closed">Clôturée</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="w-4 h-4 text-[#8A8478]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="w-4 h-4 text-[#DC2626]" />
                </Button>
              </div>
            </div>

            {/* Problème */}
            <p className="text-sm text-[#1F2937] mb-2">
              <span className="font-medium">Problème:</span> {ticket.problem}
            </p>

            {/* Actions et pièces (pour résolues/clôturées) */}
            {ticket.actions && (
              <p className="text-sm text-[#1F2937] mb-2">
                <span className="font-medium">Actions:</span> {ticket.actions}
              </p>
            )}
            {ticket.parts && (
              <p className="text-sm text-[#1F2937]">
                <span className="font-medium">Pièces:</span> {ticket.parts}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Fiches d'intervention"
        subtitle="Suivi technique de la résolution des pannes"
        actions={
          <Button className="bg-[#F2751F] hover:bg-[#F2751F]/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle fiche
          </Button>
        }
      />

      {/* Filtres de statut */}
      <div className="mb-6">
        <div className="inline-flex bg-white border border-[#E8E2D8] rounded-lg p-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-[#F2751F] text-white"
                : "text-[#8A8478] hover:text-[#1F2937]"
            }`}
          >
            Toutes ({tickets.length})
          </button>
          <button
            onClick={() => setStatusFilter("open")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === "open"
                ? "bg-[#F2751F] text-white"
                : "text-[#8A8478] hover:text-[#1F2937]"
            }`}
          >
            Ouvertes ({tickets.filter((t) => t.status === "open").length})
          </button>
          <button
            onClick={() => setStatusFilter("in-progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === "in-progress"
                ? "bg-[#F2751F] text-white"
                : "text-[#8A8478] hover:text-[#1F2937]"
            }`}
          >
            En cours ({tickets.filter((t) => t.status === "in-progress").length})
          </button>
          <button
            onClick={() => setStatusFilter("resolved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === "resolved"
                ? "bg-[#F2751F] text-white"
                : "text-[#8A8478] hover:text-[#1F2937]"
            }`}
          >
            Résolues ({tickets.filter((t) => t.status === "resolved").length})
          </button>
          <button
            onClick={() => setStatusFilter("closed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === "closed"
                ? "bg-[#F2751F] text-white"
                : "text-[#8A8478] hover:text-[#1F2937]"
            }`}
          >
            Clôturées ({tickets.filter((t) => t.status === "closed").length})
          </button>
        </div>
      </div>

      {/* Liste des fiches */}
      <div className="space-y-4">
        {filteredTickets.map(renderTicket)}
      </div>
    </div>
  );
}