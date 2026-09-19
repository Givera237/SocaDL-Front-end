// app/(dashboard)/configuration-systeme/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap, Activity, Bell, RotateCcw, Save } from "lucide-react";

// Types
interface SystemConfig {
  // Seuils électriques
  tensionMin: number;
  tensionMax: number;
  thdMax: number;
  frequenceMin: number;
  frequenceMax: number;
  // Rafraîchissement
  refreshInterval: number;
  communicationLossDelay: number;
  // Notifications
  consoleEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

// Valeurs par défaut
const DEFAULT_CONFIG: SystemConfig = {
  tensionMin: 207,
  tensionMax: 253,
  thdMax: 8,
  frequenceMin: 49.5,
  frequenceMax: 50.5,
  refreshInterval: 30,
  communicationLossDelay: 5,
  consoleEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
};

export default function SystemConfigurationPage() {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Appeler l'API pour sauvegarder
    console.log("Configuration sauvegardée:", config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const updateField = <K extends keyof SystemConfig>(
    field: K,
    value: SystemConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-5xl">
      <PageHeader
        title="Configuration système"
        subtitle="Seuils électriques globaux, rafraîchissement et notifications réseau"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-[#E8E2D8]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              className="bg-[#F2751F] hover:bg-[#F2751F]/90"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              {saved ? "Enregistré ✓" : "Enregistrer"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Section 1 : Seuils de tolérance électrique */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#F2751F]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-[#1F2937]">
                  Seuils de tolérance électrique
                </CardTitle>
                <p className="text-sm text-[#8A8478]">
                  Valeurs nominales pour l'ensemble du réseau
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Tension min (V)
                </Label>
                <Input
                  type="number"
                  value={config.tensionMin}
                  onChange={(e) =>
                    updateField("tensionMin", parseFloat(e.target.value) || 0)
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Tension max (V)
                </Label>
                <Input
                  type="number"
                  value={config.tensionMax}
                  onChange={(e) =>
                    updateField("tensionMax", parseFloat(e.target.value) || 0)
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  THD max (%)
                </Label>
                <Input
                  type="number"
                  value={config.thdMax}
                  onChange={(e) =>
                    updateField("thdMax", parseFloat(e.target.value) || 0)
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Fréquence min (Hz)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.frequenceMin}
                  onChange={(e) =>
                    updateField(
                      "frequenceMin",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Fréquence max (Hz)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.frequenceMax}
                  onChange={(e) =>
                    updateField(
                      "frequenceMax",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 : Rafraîchissement des données */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#F2751F]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-[#1F2937]">
                  Rafraîchissement des données
                </CardTitle>
                <p className="text-sm text-[#8A8478]">
                  Intervals de collecte et délais de détection
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Intervalle de rafraîchissement (secondes)
                </Label>
                <Input
                  type="number"
                  value={config.refreshInterval}
                  onChange={(e) =>
                    updateField(
                      "refreshInterval",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#1F2937]">
                  Délai communication perdue (minutes)
                </Label>
                <Input
                  type="number"
                  value={config.communicationLossDelay}
                  onChange={(e) =>
                    updateField(
                      "communicationLossDelay",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 : Préférences de notification */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#F2751F]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-[#1F2937]">
                  Préférences de notification
                </CardTitle>
                <p className="text-sm text-[#8A8478]">
                  Canaux activés par défaut pour les nouvelles alertes
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Console web */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-lg border border-[#E8E2D8]">
              <div>
                <div className="font-medium text-[#1F2937]">Console web</div>
                <div className="text-sm text-[#8A8478]">
                  Affichage dans l'interface de supervision
                </div>
              </div>
              <Switch
                checked={config.consoleEnabled}
                onCheckedChange={(checked) =>
                  updateField("consoleEnabled", checked)
                }
              />
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-lg border border-[#E8E2D8]">
              <div>
                <div className="font-medium text-[#1F2937]">Email</div>
                <div className="text-sm text-[#8A8478]">
                  Envoi d'email aux utilisateurs enregistrés
                </div>
              </div>
              <Switch
                checked={config.emailEnabled}
                onCheckedChange={(checked) =>
                  updateField("emailEnabled", checked)
                }
              />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-lg border border-[#E8E2D8]">
              <div>
                <div className="font-medium text-[#1F2937]">SMS</div>
                <div className="text-sm text-[#8A8478]">
                  Notification SMS aux techniciens d'astreinte
                </div>
              </div>
              <Switch
                checked={config.smsEnabled}
                onCheckedChange={(checked) =>
                  updateField("smsEnabled", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}