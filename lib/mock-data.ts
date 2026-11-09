import { ActivityEvent } from "@/components/dashboard/activity-feed";
import { TrendPoint } from "@/components/dashboard/trend-chart";
import {
  AlertRule,
  Equipment,
  EvolutionData,
  MaintenanceIntervention,
  PerformanceResponse,
  SiteRow,
  User,
  ZoneStats,
} from "@/services";

export const MOCK_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: "1",
    label: "Baisse de tension détectée",
    site: "Poste Yaoundé-Centre",
    timestamp: "il y a 5 min",
    severity: "warning",
  },
  {
    id: "2",
    label: "Coupure secteur confirmée",
    site: "Douala - Zone Industrielle",
    timestamp: "il y a 12 min",
    severity: "critical",
  },
  {
    id: "3",
    label: "Rétablissement du service",
    site: "Bamenda - Poste Nord",
    timestamp: "il y a 45 min",
    severity: "info",
  },
  {
    id: "4",
    label: "Température élevée transformateur",
    site: "Garoua - Station 2",
    timestamp: "il y a 1h",
    severity: "warning",
  },
  {
    id: "5",
    label: "Maintenance préventive terminée",
    site: "Bertoua - Principal",
    timestamp: "il y a 2h",
    severity: "info",
  },
];

export const MOCK_TREND_DATA: TrendPoint[] = [
  { date: "01/11", saidi: 45, saifi: 0.5 },
  { date: "02/11", saidi: 52, saifi: 0.6 },
  { date: "03/11", saidi: 48, saifi: 0.4 },
  { date: "04/11", saidi: 60, saifi: 0.8 },
  { date: "05/11", saidi: 55, saifi: 0.7 },
  { date: "06/11", saidi: 42, saifi: 0.5 },
  { date: "07/11", saidi: 65, saifi: 0.9 },
  { date: "08/11", saidi: 58, saifi: 0.75 },
  { date: "09/11", saidi: 60, saifi: 0.89 },
];

// ── MinMax cards (dashboard) ────────────────────────────────────────────
export const MOCK_MINMAX_CARDS = [
  { label: "TENSION", unit: "V", max: 235.6, min: 215.2 },
  { label: "FRÉQUENCE", unit: "Hz", max: 50.12, min: 49.85 },
  { label: "PUISSANCE ACTIVE", unit: "kW", max: 1240, min: 850 },
  { label: "FACTEUR DE PUISSANCE", unit: "", max: 0.98, min: 0.92 },
];

// ── Sites (table des postes) ────────────────────────────────────────────
export const MOCK_SITES: SiteRow[] = [
  { id: "1", name: "Poste Ngaoundéré", code: "NGR-CTR-01", zone: "Adamaoua", subscribers: 4100, tensionV: 199.3, frequencyHz: 49.78, status: "offline", lastCommDays: 41 },
  { id: "2", name: "Poste Maroua", code: "MRA-CTR-01", zone: "Extrême-Nord", subscribers: 3800, tensionV: 229.2, frequencyHz: 50.06, status: "offline", lastCommDays: 41 },
  { id: "3", name: "Poste Kribi", code: "KRB-CTR-01", zone: "Sud", subscribers: 3100, tensionV: 231.9, frequencyHz: 50.01, status: "offline", lastCommDays: 41 },
  { id: "4", name: "Poste Hippodrome", code: "YDE-HIP-02", zone: "Yaoundé", subscribers: 8200, tensionV: 228.9, frequencyHz: 50.01, status: "offline", lastCommDays: 41 },
  { id: "5", name: "Poste Garoua", code: "GAR-CTR-01", zone: "Nord", subscribers: 4300, tensionV: 230.3, frequencyHz: 50.06, status: "offline", lastCommDays: 41 },
  { id: "6", name: "Poste Centre-Yaoundé", code: "YDE-CTR-01", zone: "Yaoundé", subscribers: 12500, tensionV: 233.5, frequencyHz: 50.04, status: "offline", lastCommDays: 41 },
  { id: "7", name: "Poste Bonanjo", code: "DLA-BNJ-01", zone: "Douala", subscribers: 18000, tensionV: 234.4, frequencyHz: 50.08, status: "offline", lastCommDays: 41 },
  { id: "8", name: "Poste Bamenda", code: "BDA-CTR-01", zone: "Nord-Ouest", subscribers: 5200, tensionV: 227.4, frequencyHz: 50.07, status: "offline", lastCommDays: 41 },
  { id: "9", name: "Poste Bafoussam", code: "BFO-CTR-01", zone: "Ouest", subscribers: 6500, tensionV: 225.8, frequencyHz: 49.96, status: "offline", lastCommDays: 41 },
  { id: "10", name: "Poste Akwa", code: "DLA-AKW-02", zone: "Douala", subscribers: 9500, tensionV: 200.9, frequencyHz: 49.77, status: "offline", lastCommDays: 41 },
  { id: "11", name: "Data Center Douala", code: "DLA-DC-01", zone: "Douala", subscribers: 1500, tensionV: 232.7, frequencyHz: 50.03, status: "offline", lastCommDays: 41 },
];

// ── Interventions / Maintenance ─────────────────────────────────────────
export const MOCK_INTERVENTIONS: MaintenanceIntervention[] = [
  {
    id: "int-1",
    siteName: "Poste Yaoundé-Centre",
    technician: "Jean Nkoulou",
    problem: "Disjoncteur principal déclenche intempestivement",
    actions: "Remplacement du relais de protection",
    parts: "Relais DVP-220",
    status: "open",
    createdAt: "2026-11-07T08:30:00Z",
    eventDate: "06/11/2026",
  },
  {
    id: "int-2",
    siteName: "Poste Douala-Bonanjo",
    technician: "Awa Bello",
    problem: "Surchauffe transformateur T2 dépassant 85°C",
    actions: "Vérification ventilation, nettoyage radiateurs",
    parts: "Ventilateurs axiaux",
    status: "in-progress",
    createdAt: "2026-11-06T14:15:00Z",
    eventDate: "06/11/2026",
  },
  {
    id: "int-3",
    siteName: "Poste Bamenda-Nord",
    technician: "Moussa Ngoufan",
    problem: "Coupure complète du départ D4",
    actions: "Isolation et réparation du câble souterrain",
    parts: "Boîte de jonction 90mm²",
    status: "resolved",
    createdAt: "2026-11-04T10:00:00Z",
    eventDate: "03/11/2026",
  },
  {
    id: "int-4",
    siteName: "Poste Garoua-Station 2",
    technician: "Lydia Ebane",
    problem: "Contrôle annuel conventionnel du transformateur",
    actions: "Analyse d'huile, contrôle d'isolement, serrage des connexions",
    parts: "Filtre à huile",
    status: "closed",
    createdAt: "2026-10-28T09:20:00Z",
    eventDate: "27/10/2026",
  },
];

// ── Alertes ─────────────────────────────────────────────────────────────
export const MOCK_ALERT_RULES: AlertRule[] = [
  {
    id: "ar-1",
    criterion: "Tension",
    scope: "global",
    minThreshold: 207,
    maxThreshold: 253,
    unit: "V",
    description: "Alerte si la tension sort de la plage réglementaire土著 207–253 V",
    channels: ["SMS", "Email"],
    enabled: true,
    priority: true,
  },
  {
    id: "ar-2",
    criterion: "Fréquence",
    scope: "global",
    minThreshold: 49.5,
    maxThreshold: 50.5,
    unit: "Hz",
    description: "Alerte si la fréquence dévie de plus de ±0,5 Hz",
    channels: ["Console"],
    enabled: true,
  },
  {
    id: "ar-3",
    criterion: "THD",
    scope: "site",
    siteName: "Poste Douala-Akwa",
    minThreshold: 0,
    maxThreshold: 5,
    unit: "%",
    description: "Distorsion harmonique totale supérieure à 5 % → pollution harmonique",
    channels: ["SMS", "Console"],
    enabled: false,
  },
  {
    id: "ar-4",
    criterion: "Courant",
    scope: "site",
    siteName: "Poste Yaoundé-Hippodrome",
    minThreshold: 0,
    maxThreshold: 120,
    unit: "A",
    description: "Dépassement du courant de réglage du départ principal",
    channels: ["Email"],
    enabled: true,
  },
];

// ── Inventaire (équipements) ────────────────────────────────────────────
export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: "eq-1",
    name: "Transformateur T1",
    model: "Siemens SIE-315",
    type: "Transformateur",
    installDate: "2015-03-12",
    age: 11,
    lifespan: 25,
    status: "operational",
    siteId: "6",
    site: { id: "6", name: "Poste Centre-Yaoundé", code: "YDE-CTR-01" },
  },
  {
    id: "eq-2",
    name: "Transformateur T2",
    model: "ABB UTH-500",
    type: "Transformateur",
    installDate: "2018-07-20",
    age: 8,
    lifespan: 25,
    status: "operational",
    siteId: "7",
    site: { id: "7", name: "Poste Bonanjo", code: "DLA-BNJ-01" },
  },
  {
    id: "eq-3",
    name: "Disjoncteur départ D3",
    model: "Schneider MasterPact",
    type: "Disjoncteur",
    installDate: "2020-11-02",
    age: 6,
    lifespan: 20,
    status: "maintenance",
    siteId: "9",
    site: { id: "9", name: "Poste Bafoussam", code: "BFO-CTR-01" },
  },
  {
    id: "eq-4",
    name: "Compensateur de puissance réactive",
    model: "Legrand VarPlus",
    type: "Banc de condensateurs",
    installDate: "2023-01-15",
    age: 3,
    lifespan: 15,
    status: "operational",
    siteId: "10",
    site: { id: "10", name: "Poste Akwa", code: "DLA-AKW-02" },
  },
  {
    id: "eq-5",
    name: "Compteur intelligent G3",
    model: "Itron OpenWay",
    type: "Compteur",
    installDate: "2019-05-30",
    age: 7,
    lifespan: 12,
    status: "operational",
    siteId: "5",
    site: { id: "5", name: "Poste Garoua", code: "GAR-CTR-01" },
  },
];

// ── Rapports : zones IEEE 1366 ──────────────────────────────────────────
export const MOCK_ZONE_STATS: ZoneStats[] = [
  { id: "z1", name: "Yaoundé", sites: 3, subscribers: 20700, outages: 148, saidi: 62.4, saifi: 0.92, caidi: 67.8 },
  { id: "z2", name: "Douala", sites: 3, subscribers: 29000, outages: 235, saidi: 78.1, saifi: 1.24, caidi: 63.0 },
  { id: "z3", name: "Bamenda", sites: 1, subscribers: 5200, outages: 42, saidi: 48.9, saifi: 0.67, caidi: 73.0 },
  { id: "z4", name: "Garoua", sites: 1, subscribers: 4300, outages: 31, saidi: 36.2, saifi: 0.51, caidi: 71.0 },
  { id: "z5", name: "Bafoussam", sites: 1, subscribers: 6500, outages: 58, saidi: 54.3, saifi: 0.78, caidi: 69.6 },
  { id: "z6", name: "Ngaoundéré", sites: 1, subscribers: 4100, outages: 61, saidi: 71.5, saifi: 1.05, caidi: 68.1 },
];

export const MOCK_EVOLUTION_DATA: EvolutionData[] = [
  { date: "01/11", saidi: 45, saifi: 0.5 },
  { date: "02/11", saidi: 52, saifi: 0.6 },
  { date: "03/11", saidi: 48, saifi: 0.4 },
  { date: "04/11", saidi: 60, saifi: 0.8 },
  { date: "05/11", saidi: 55, saifi: 0.7 },
  { date: "06/11", saidi: 42, saifi: 0.5 },
  { date: "07/11", saidi: 65, saifi: 0.9 },
  { date: "08/11", saidi: 58, saifi: 0.75 },
  { date: "09/11", saidi: 60, saifi: 0.89 },
];

// ── Performance ─────────────────────────────────────────────────────────
export const MOCK_PERFORMANCE: PerformanceResponse = {
  indicators: [
    {
      label: "SAIDI",
      value: 60.3,
      unit: "min",
      target: 120,
      targetUnit: "min",
      description: "Durée moyenne de coupure par abonné",
      status: "good",
      statusLabel: "Bon",
      progress: 50,
    },
    {
      label: "SAIFI",
      value: 0.89,
      unit: "int/ab",
      target: 2,
      targetUnit: "int/ab",
      description: "Fréquence moyenne d'interruptions par abonné",
      status: "excellent",
      statusLabel: "Excellent",
      progress: 56,
    },
    {
      label: "Taux d'exécution maintenances",
      value: 87,
      unit: "%",
      target: 95,
      targetUnit: "%",
      description: "Maintenances planifiées réalisées sur la période",
      status: "warning",
      statusLabel: "À améliorer",
      progress: 92,
      isPercentage: true,
    },
    {
      label: "Disponibilité réseau",
      value: 99.76,
      unit: "%",
      target: 99.9,
      targetUnit: "%",
      description: "Temps de disponibilité du service électrique",
      status: "good",
      statusLabel: "Bon",
      progress: 99.8,
      isPercentage: true,
    },
  ],
  ytdOutages: 612,
  totalMinutesClient: 4824,
  globalScore: 86,
};

// ── Utilisateurs ────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: "1", email: "franck.nzokou@facsciences-uy1.cm", role: "Administrateur" },
  { id: "2", email: "giveraango@gmail.com", role: "Administrateur" },
  { id: "u3", email: "tech.yde@socadel.cm", role: "Technicien" },
  { id: "u4", email: "arsel.regulateur@arsel.cm", role: "Lecture ARSEL" },
];
