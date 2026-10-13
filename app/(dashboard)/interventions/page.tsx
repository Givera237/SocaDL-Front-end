"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { api, InterventionTicket, InterventionStatus } from "@/services";

export default function InterventionTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | InterventionStatus>("all");
  const [tickets, setTickets] = useState<InterventionTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les fiches d'intervention depuis NestJS / PostgreSQL
  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await api.getInterventions();
        setTickets(data);
      } catch (err: any) {
        console.error("Erreur de chargement des interventions :", err);
        setError("Impossible de charger les fiches d'intervention.");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

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

  // Mise à jour synchrone de l'UI & asynchrone sur le Backend NestJS
  const handleStatusChange = async (ticketId: string, newStatus: InterventionStatus) => {
    // 1. Mise à jour optimiste du state local
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );

    try {
      // 2. Appel de l'API REST
      await api.updateIntervention(ticketId, { status: newStatus });
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de l'intervention #${ticketId}:`, err);
      // Optionnel : Recharger la liste en cas d'erreur de réseau
      const freshData = await api.getInterventions();
      setTickets(freshData);
    }
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette fiche d'intervention ?")) return;

    setTickets((prev) => prev.filter((t) => t.id !== ticketId));

    try {
      await api.deleteIntervention(ticketId);
    } catch (err) {
      console.error(`Erreur de suppression de l'intervention #${ticketId}:`, err);
      const freshData = await api.getInterventions();
      setTickets(freshData);
    }
  };

  const renderTicket = (ticket: InterventionTicket) => {
    const siteDisplayName = ticket.siteName ?? ticket.site?.name ?? "Site non spécifié";
    const formattedCreatedAt = ticket.createdAt
      ? new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date inconnue";

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
                  <h3 className="font-semibold text-[#1F2937]">{siteDisplayName}</h3>
                  {ticket.eventDate && (
                    <span className="px-2 py-0.5 bg-[#E8E2D8] rounded text-xs text-[#8A8478]">
                      Évt: {ticket.eventDate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#8A8478]">
                  • Technicien: {ticket.technician || "Non assigné"} <br />
                  • Créée le: {formattedCreatedAt} <br />
                  • Durée: {ticket.duration || "0 min"}
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
                  <SelectTrigger className="w-[130px] h-8">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(ticket.id)}
                >
                  <Trash2 className="w-4 h-4 text-[#DC2626]" />
                </Button>
              </div>
            </div>

            {/* Problème */}
            <p className="text-sm text-[#1F2937] mb-2">
              <span className="font-medium">Problème:</span> {ticket.problem}
            </p>

            {/* Actions et pièces */}
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
        <div className="inline-flex bg-white border border-[#E8E2D8] rounded-lg p-1 flex-wrap gap-1">
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

      {/* État de chargement / Erreur / Liste */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement des interventions...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#E8E2D8] rounded-xl text-[#8A8478]">
          Aucune fiche d'intervention ne correspond au filtre sélectionné.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map(renderTicket)}
        </div>
      )}
    </div>
  );
}