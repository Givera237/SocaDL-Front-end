// app/(dashboard)/inventaire/page.tsx
"use client";

import { useState } from "react";
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
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// Types
type EquipmentStatus = "operational" | "maintenance";

interface Equipment {
  id: string;
  name: string;
  model: string;
  site: string;
  type: string;
  installDate: string;
  age: number; // en années
  lifespan: number; // en années
  status: EquipmentStatus;
}

// Données mockées
const MOCK_EQUIPMENTS: Equipment[] = [
  {
    id: "1",
    name: "Batterie MRA-CTR-01-1",
    model: "Yuasa Mod-1276",
    site: "Poste Maroua",
    type: "Batterie",
    installDate: "17/12/2023",
    age: 2.8,
    lifespan: 8,
    status: "operational",
  },
  {
    id: "2",
    name: "Onduleur BDA-CTR-01-2",
    model: "Eaton Mod-1628",
    site: "Poste Bamenda",
    type: "Onduleur",
    installDate: "17/11/2023",
    age: 2.8,
    lifespan: 10,
    status: "operational",
  },
  {
    id: "3",
    name: "Régulateur DLA-AKW-02-2",
    model: "ABB Mod-5943",
    site: "Poste Akwa",
    type: "Régulateur",
    installDate: "06/07/2023",
    age: 3.2,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "4",
    name: "Batterie YDE-HIP-02-3",
    model: "Yuasa Mod-7606",
    site: "Poste Hippodrome",
    type: "Batterie",
    installDate: "06/05/2023",
    age: 3.4,
    lifespan: 8,
    status: "operational",
  },
  {
    id: "5",
    name: "Disjoncteur YDE-CTR-01-2",
    model: "Legrand Mod-6693",
    site: "Poste Centre-Yaoundé",
    type: "Disjoncteur",
    installDate: "11/01/2023",
    age: 3.7,
    lifespan: 20,
    status: "operational",
  },
  {
    id: "6",
    name: "Compteur DLA-BNJ-01-2",
    model: "Itron Mod-2071",
    site: "Poste Bonanjo",
    type: "Compteur",
    installDate: "04/10/2022",
    age: 4.0,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "7",
    name: "Batterie YDE-HOP-01-2",
    model: "Sonnen Mod-7410",
    site: "Centre Hospitalier Universitaire",
    type: "Batterie",
    installDate: "02/09/2022",
    age: 4.0,
    lifespan: 8,
    status: "operational",
  },
  {
    id: "8",
    name: "Transformateur NGR-CTR-01-2",
    model: "Siemens Mod-4509",
    site: "Poste Ngaoundéré",
    type: "Transformateur",
    installDate: "10/07/2022",
    age: 4.2,
    lifespan: 25,
    status: "operational",
  },
  {
    id: "9",
    name: "Transformateur YDE-CTR-01-1",
    model: "Schneider Mod-1691",
    site: "Poste Centre-Yaoundé",
    type: "Transformateur",
    installDate: "04/04/2022",
    age: 4.5,
    lifespan: 25,
    status: "operational",
  },
  {
    id: "10",
    name: "Régulateur MRA-CTR-01-3",
    model: "Schneider Mod-7611",
    site: "Poste Maroua",
    type: "Régulateur",
    installDate: "05/10/2021",
    age: 5.0,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "11",
    name: "Régulateur KRB-CTR-01-2",
    model: "ABB Mod-1091",
    site: "Poste Kribi",
    type: "Régulateur",
    installDate: "17/07/2018",
    age: 8.2,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "12",
    name: "Onduleur YDE-HIP-02-2",
    model: "Eaton Mod-5981",
    site: "Poste Hippodrome",
    type: "Onduleur",
    installDate: "04/06/2018",
    age: 8.3,
    lifespan: 10,
    status: "operational",
  },
  {
    id: "13",
    name: "Compteur MRA-CTR-01-2",
    model: "Itron Mod-6646",
    site: "Poste Maroua",
    type: "Compteur",
    installDate: "28/04/2017",
    age: 9.4,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "14",
    name: "Batterie DLA-BNJ-01-1",
    model: "Yuasa Mod-7157",
    site: "Poste Bonanjo",
    type: "Batterie",
    installDate: "17/01/2017",
    age: 9.7,
    lifespan: 8,
    status: "maintenance",
  },
  {
    id: "15",
    name: "Transformateur BFO-CTR-01-1",
    model: "Schneider Mod-9143",
    site: "Poste Bafoussam",
    type: "Transformateur",
    installDate: "10/01/2017",
    age: 9.7,
    lifespan: 25,
    status: "operational",
  },
  {
    id: "16",
    name: "Régulateur NGR-CTR-01-1",
    model: "Schneider Mod-9147",
    site: "Poste Ngaoundéré",
    type: "Régulateur",
    installDate: "27/11/2016",
    age: 9.8,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "17",
    name: "Onduleur GAR-CTR-01-1",
    model: "APC Mod-3020",
    site: "Poste Garoua",
    type: "Onduleur",
    installDate: "09/10/2016",
    age: 9.9,
    lifespan: 10,
    status: "maintenance",
  },
  {
    id: "18",
    name: "Batterie GAR-CTR-01-2",
    model: "Sonnen Mod-4635",
    site: "Poste Garoua",
    type: "Batterie",
    installDate: "07/05/2016",
    age: 10.4,
    lifespan: 8,
    status: "operational",
  },
  {
    id: "19",
    name: "Disjoncteur BFO-CTR-01-2",
    model: "Legrand Mod-8885",
    site: "Poste Bafoussam",
    type: "Disjoncteur",
    installDate: "02/02/2016",
    age: 10.6,
    lifespan: 20,
    status: "operational",
  },
  {
    id: "20",
    name: "Régulateur DLA-BNJ-01-3",
    model: "Schneider Mod-4544",
    site: "Poste Bonanjo",
    type: "Régulateur",
    installDate: "14/01/2016",
    age: 10.7,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "21",
    name: "Compteur KRB-CTR-01-1",
    model: "Landis+Gyr Mod-3798",
    site: "Poste Kribi",
    type: "Compteur",
    installDate: "24/12/2015",
    age: 10.7,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "22",
    name: "Régulateur DLA-DC-01-1",
    model: "Schneider Mod-4523",
    site: "Data Center Douala",
    type: "Régulateur",
    installDate: "06/11/2015",
    age: 10.9,
    lifespan: 15,
    status: "operational",
  },
  {
    id: "23",
    name: "Transformateur DLA-AKW-02-3",
    model: "ABB Mod-4150",
    site: "Poste Akwa",
    type: "Transformateur",
    installDate: "20/06/2015",
    age: 11.2,
    lifespan: 25,
    status: "operational",
  },
];

export default function InventoryPage() {
  const [siteFilter, setSiteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [equipments] = useState<Equipment[]>(MOCK_EQUIPMENTS);

  // Extraire les sites et types uniques pour les filtres
  const sites = Array.from(new Set(equipments.map((e) => e.site))).sort();
  const types = Array.from(new Set(equipments.map((e) => e.type))).sort();

  // Filtrer les équipements
  const filteredEquipments = equipments.filter((equipment) => {
    const matchSite = siteFilter === "all" || equipment.site === siteFilter;
    const matchType = typeFilter === "all" || equipment.type === typeFilter;
    return matchSite && matchType;
  });

  // Calculer le pourcentage de vie restante
  const getLifePercentage = (age: number, lifespan: number) => {
    const remaining = lifespan - age;
    const percentage = Math.max(0, (remaining / lifespan) * 100);
    return percentage;
  };

  // Déterminer la couleur de la barre de vie
  const getLifeBarColor = (age: number, lifespan: number) => {
    const percentage = (age / lifespan) * 100;
    if (percentage >= 100) return "bg-[#DC2626]"; // Rouge - dépassé
    if (percentage >= 80) return "bg-[#F2751F]"; // Orange - critique
    return "bg-[#16A34A]"; // Vert - OK
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

      {/* Tableau */}
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
                const barColor = getLifeBarColor(equipment.age, equipment.lifespan);

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

                    {/* Site */}
                    <td className="px-4 py-4 text-sm text-[#1F2937]">
                      {equipment.site}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4 text-sm text-[#1F2937]">
                      {equipment.type}
                    </td>

                    {/* Date d'installation */}
                    <td className="px-4 py-4 text-sm text-[#1F2937]">
                      {equipment.installDate}
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
    </div>
  );
}