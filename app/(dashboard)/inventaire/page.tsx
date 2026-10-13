// app/(dashboard)/inventaire/page.tsx
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
import { Pencil, Trash2, Plus, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { api, Equipment } from "@/services";

export default function InventoryPage() {
  const [siteFilter, setSiteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données réelles depuis NestJS
  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true);
        const data = await api.getEquipment();
        setEquipments(data);
      } catch (err: any) {
        console.error("Erreur de chargement :", err);
        setError("Impossible de charger l'inventaire matériel.");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  // Extraction dynamique des nom de sites (via equipment.site?.name) et types uniques
  const sites = Array.from(
    new Set(equipments.map((e) => e.site?.name).filter(Boolean) as string[])
  ).sort();

  const types = Array.from(
    new Set(equipments.map((e) => e.type).filter(Boolean))
  ).sort();

  // Filtrer les équipements
  const filteredEquipments = equipments.filter((equipment) => {
    const siteName = equipment.site?.name;
    const matchSite = siteFilter === "all" || siteName === siteFilter;
    const matchType = typeFilter === "all" || equipment.type === typeFilter;
    return matchSite && matchType;
  });

  const getLifePercentage = (age: number, lifespan: number) => {
    if (!lifespan) return 100;
    const remaining = lifespan - age;
    return Math.max(0, (remaining / lifespan) * 100);
  };

  const getLifeBarColor = (age: number, lifespan: number) => {
    if (!lifespan) return "bg-[#16A34A]";
    const percentage = (age / lifespan) * 100;
    if (percentage >= 100) return "bg-[#DC2626]";
    if (percentage >= 80) return "bg-[#F2751F]";
    return "bg-[#16A34A]";
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Inventaire matériel"
        subtitle="Équipements installés, durée de vie et état"
        actions={
          <Button className="bg-[#F2751F] hover:bg-[#F2751F]/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel équipement
          </Button>
        }
      />

      {/* Filtres */}
      <div className="mb-6 flex items-center gap-4">
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous les sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les sites</SelectItem>
            {sites.map((site) => (
              <SelectItem key={site} value={site}>
                {site}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-[#8A8478]">
          {filteredEquipments.length} équipement(s)
        </span>
      </div>

      {/* État de chargement / Erreur */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E2D8] rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#F2751F] mr-2" />
          <span className="text-[#8A8478]">Chargement de l'inventaire...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      ) : (
        /* Tableau */
        <div className="bg-white border border-[#E8E2D8] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF7F2] border-b border-[#E8E2D8]">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    ÉQUIPEMENT
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    SITE
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    TYPE
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    INSTALLÉ LE
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    ÂGE / DURÉE DE VIE
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    STATUT
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#8A8478]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {filteredEquipments.map((equipment) => {
                  const lifePercentage = getLifePercentage(
                    equipment.age,
                    equipment.lifespan
                  );
                  const barColor = getLifeBarColor(
                    equipment.age,
                    equipment.lifespan
                  );

                  return (
                    <tr key={equipment.id} className="hover:bg-[#FAF7F2]/50">
                      {/* Équipement */}
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-[#1F2937]">
                            {equipment.name}
                          </div>
                          <div className="text-sm text-[#8A8478]">
                            {equipment.model}
                          </div>
                        </div>
                      </td>

                      {/* Site (accès via l'objet relationnel) */}
                      <td className="px-4 py-4 text-sm text-[#1F2937]">
                        {equipment.site?.name ?? "Non assigné"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4 text-sm text-[#1F2937]">
                        {equipment.type}
                      </td>

                      {/* Date d'installation */}
                      <td className="px-4 py-4 text-sm text-[#1F2937]">
                        {new Date(equipment.installDate).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Âge / Durée de vie */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 w-24">
                            <div className="h-2 bg-[#E8E2D8] rounded-full overflow-hidden">
                              <div
                                className={`h-full ${barColor} rounded-full`}
                                style={{ width: `${lifePercentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-[#8A8478] whitespace-nowrap font-[JetBrains Mono]">
                            {equipment.age}/{equipment.lifespan}a
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="px-4 py-4">
                        {equipment.status === "operational" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#16A34A]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Opérationnel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFEDD5] text-[#F2751F]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            En maintenance
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4 text-[#8A8478]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-[#DC2626]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}