// app/(dashboard)/alertes/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Globe, Building2 } from "lucide-react";

// Types
type AlertCriterion = "THD" | "Tension" | "Fréquence" | "Puissance" | "Courant";
type AlertScope = "global" | "site";
type NotificationChannel = "SMS" | "Email" | "Console";

interface AlertRule {
  id: string;
  criterion: AlertCriterion;
  scope: AlertScope;
  siteName?: string;
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  description: string;
  channels: NotificationChannel[];
  enabled: boolean;
  priority?: boolean;
}

// Données mockées
const MOCK_RULES: AlertRule[] = [
  {
    id: "1",
    criterion: "THD",
    scope: "global",
    minThreshold: 0.0,
    maxThreshold: 8.0,
    unit: "%",
    description: "Distorsion harmonique maximale acceptable",
    channels: ["Console"],
    enabled: true,
  },
  {
    id: "2",
    criterion: "Tension",
    scope: "global",
    minThreshold: 207.0,
    maxThreshold: 253.0,
    unit: "V",
    description: "Seuil nominal tension ±10% (tous sites)",
    channels: ["Email", "Console"],
    enabled: false,
  },
  {
    id: "3",
    criterion: "Tension",
    scope: "site",
    siteName: "Centre Hospitalier Universitaire",
    minThreshold: 214.0,
    maxThreshold: 246.0,
    unit: "V",
    description: "Seuil renforcé — site sensible (hôpital)",
    channels: ["SMS", "Email", "Console"],
    enabled: true,
    priority: true,
  },
  {
    id: "4",
    criterion: "Fréquence",
    scope: "global",
    minThreshold: 49.5,
    maxThreshold: 50.5,
    unit: "Hz",
    description: "Seuil nominal fréquence ±0.5 Hz",
    channels: ["Email", "Console"],
    enabled: true,
  },
];

export default function AlertConfigurationPage() {
  const [rules, setRules] = useState<AlertRule[]>(MOCK_RULES);

  const handleToggle = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
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

      {/* Liste des règles */}
      <div className="space-y-4">
        {rules.map((rule) => (
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
                      {rule.scope === "global" ? "Global" : rule.siteName}
                    </span>
                    {rule.priority && (
                      <Badge className="bg-[#FEF3C7] text-[#F2751F] border-0 hover:bg-[#FEF3C7]">
                        Prioritaire
                      </Badge>
                    )}
                  </div>

                  {/* Seuil */}
                  <p className="text-sm font-[JetBrains Mono] text-[#1F2937] mb-1">
                    Seuil: {rule.minThreshold} - {rule.maxThreshold} {rule.unit}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#8A8478]">
                    {rule.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Canaux de notification */}
                  <div className="flex items-center gap-1.5">
                    {rule.channels.map((channel) => (
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
        ))}
      </div>
    </div>
  );
}