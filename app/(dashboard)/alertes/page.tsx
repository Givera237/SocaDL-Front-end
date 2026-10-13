"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Globe, Building2, Loader2 } from "lucide-react";
import { api, AlertRule } from "@/services";

export default function AlertConfigurationPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les règles d'alerte depuis NestJS / PostgreSQL
  useEffect(() => {
    async function fetchRules() {
      try {
        setLoading(true);
        const data = await api.getAlertRules();
        setRules(data);
      } catch (err: any) {
        console.error("Erreur de chargement des règles d'alerte :", err);
        setError("Impossible de charger les règles d'alerte.");
      } finally {
        setLoading(false);
      }
    }

    fetchRules();
  }, []);

  // Activer/Désactiver une règle avec mise à jour en BDD
  const handleToggle = async (ruleId: string) => {
    const currentRule = rules.find((r) => r.id === ruleId);
    if (!currentRule) return;

    const newEnabledState = !currentRule.enabled;

    // 1. Mise à jour optimiste de l'UI
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: newEnabledState } : r))
    );

    try {
      // 2. Persistance dans PostgreSQL
      await api.updateAlertRule(ruleId, { enabled: newEnabledState });
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la règle #${ruleId}:`, err);
      // Recharger les données d'origine en cas d'échec
      const freshRules = await api.getAlertRules();
      setRules(freshRules);
    }
  };

  // Supprimer une règle d'alerte
  const handleDelete = async (ruleId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette règle d'alerte ?")) return;

    setRules((prev) => prev.filter((r) => r.id !== ruleId));

    try {
      await api.deleteAlertRule(ruleId);
    } catch (err) {
      console.error(`Erreur lors de la suppression de la règle #${ruleId}:`, err);
      const freshRules = await api.getAlertRules();
      setRules(freshRules);
    }
  };

  const handleNewRule = () => {
    // TODO: Ouvrir un modal de création
    console.log("Nouvelle règle");
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Configuration des alertes"
        subtitle="Seuils configurables par critère et par site"
        actions={
          <Button
            className="bg-[#F2751F] hover:bg-[#F2751F]/90"
            onClick={handleNewRule}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle règle
          </Button>
        }
      />

      {/* État de chargement / Erreur / Liste */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement des règles d'alerte...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : rules.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#E8E2D8] rounded-xl text-[#8A8478]">
          Aucune règle d'alerte configurée.
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const siteDisplayName =
              rule.scope === "global"
                ? "Global"
                : rule.siteName ?? rule.site?.name ?? "Site spécifique";

            return (
              <Card key={rule.id} className="border-[#E8E2D8]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                      {rule.scope === "global" ? (
                        <Globe className="w-6 h-6 text-[#F2751F]" />
                      ) : (
                        <Building2 className="w-6 h-6 text-[#F2751F]" />
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* En-tête */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1F2937]">
                          {rule.criterion}
                        </h3>
                        <span className="text-[#8A8478]">•</span>
                        <span className="text-sm text-[#8A8478]">
                          {siteDisplayName}
                        </span>
                        {rule.priority && (
                          <Badge className="bg-[#FEF3C7] text-[#F2751F] border-0 hover:bg-[#FEF3C7]">
                            Prioritaire
                          </Badge>
                        )}
                      </div>

                      {/* Seuil */}
                      <p className="text-sm font-[JetBrains Mono] text-[#1F2937] mb-1">
                        • Seuil: {rule.minThreshold} à {rule.maxThreshold} {rule.unit}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#8A8478]">
                        {rule.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* Canaux de notification */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rule.channels?.map((channel) => (
                          <Badge
                            key={channel}
                            variant="outline"
                            className="border-[#E8E2D8] text-[#8A8478] bg-white"
                          >
                            {channel}
                          </Badge>
                        ))}
                      </div>

                      {/* Toggle */}
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggle(rule.id)}
                      />

                      {/* Boutons edit/delete */}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4 text-[#8A8478]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="w-4 h-4 text-[#DC2626]" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}