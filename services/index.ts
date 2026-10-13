// services/index.ts
import { apiClient } from "@/lib/api-client";

// ==========================================
// TYPES (Calqués sur vos interfaces existantes)
// ==========================================
export type SiteStatus = "online" | "offline" | "maintenance" | "warning";

export interface SiteRow {
  id: string;
  name: string;
  code: string;
  zone: string;
  subscribers: number;
  tensionV: number;
  frequencyHz: number;
  status: SiteStatus;
  lastCommDays: number;
  equipments?: any[];
  interventions?: any[];
}

export type EquipmentStatus = "operational" | "maintenance";

export interface Equipment {
  id: string;
  name: string;
  model: string;
  type: string;
  installDate: string; // Format ISO string depuis PostgreSQL
  age: number;         // en années
  lifespan: number;    // en années
  status: EquipmentStatus;
  siteId?: string;
  // Prisma inclut le site sous forme d'objet
  site?: {
    id: string;
    name: string;
    code?: string;
  };
}
export type InterventionStatus = "open" | "in-progress" | "resolved" | "closed";

export interface InterventionTicket {
  id: string;
  siteId?: string;
  siteName?: string;
  site?: {
    id: string;
    name: string;
  };
  eventDate?: string;
  createdAt: string;
  technician: string;
  problem: string;
  actions?: string;
  parts?: string;
  status: InterventionStatus;
  duration?: string;
}
export type AlertCriterion = "THD" | "Tension" | "Fréquence" | "Puissance" | "Courant";
export type AlertScope = "global" | "site";
export type NotificationChannel = "SMS" | "Email" | "Console";

export interface AlertRule {
  id: string;
  criterion: AlertCriterion;
  scope: AlertScope;
  siteName?: string;
  siteId?: string;
  site?: {
    id: string;
    name: string;
  };
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  description: string;
  channels: NotificationChannel[];
  enabled: boolean;
  priority?: boolean;
}
export interface ZoneStats {
  id: string;
  name: string;
  sites: number;
  subscribers: number;
  outages: number;
  saidi: number; // min/abonné
  saifi: number; // interruptions/abonné
  caidi: number; // min/interruption
}

export interface EvolutionData {
  date: string;    // Format: "DD/MM"
  saidi: number;
  saifi: number;
}

export interface PerformanceIndicator {
  label: string;
  value: number;
  unit: string;
  target: number;
  targetUnit: string;
  targetPrefix?: string;
  description: string;
  status: "excellent" | "good" | "warning";
  statusLabel: string;
  progress: number; // 0-100
  isPercentage?: boolean;
  inverseProgress?: boolean;
}

export type UserRole = "Administrateur" | "Technicien" | "Lecture ARSEL";
export interface User {
  id: string;
  email: string;
  role: UserRole;
}



export type MaintenancePriority = "haute" | "moyenne" | "basse";
export type MaintenanceStatus = "planifiee" | "en-cours" | "terminee" | "open" | "in-progress" | "resolved" | "closed";
export type MaintenanceType = "preventive" | "corrective" | "inspection" | "calibration";

export interface MaintenanceIntervention {
  id: string;
  title?: string;
  problem?: string;
  priority?: MaintenancePriority;
  location?: string;
  siteName?: string;
  site?: {
    id: string;
    name: string;
  };
  type?: MaintenanceType;
  technician: string;
  plannedDate?: string;
  realizedDate?: string;
  createdAt?: string;
  eventDate?: string;
  description?: string;
  actions?: string;
  parts?: string;
  status: MaintenanceStatus;
}


// services/index.ts

export interface ZoneReport {
  id: string;
  name: string;
  sites: number;
  subscribers: number;
  outages: number;
  saidi: number;
  saifi: number;
  caidi: number;
}

export interface EvolutionData {
  date: string;
  saidi: number;
  saifi: number;
}

// ==========================================
// FONCTIONS D'APPEL API
// ==========================================

export const api = {
  // 1. Tableau de bord
  getDashboardSummary: (period: string = "7d", zone: string = "all") => 
    apiClient.get<any>("/dashboard/summary", { period, zone }),

  // 2. Sites
 getSites: () => apiClient.get<SiteRow[]>("/sites"),

  // 3. Inventaire
  getEquipment: () => apiClient.get<Equipment[]>("/equipments"),

  // 5. Alertes
  getAlertRules: () => apiClient.get<AlertRule[]>("/alert-rules"),
  updateAlertRule: (id: string, data: Partial<AlertRule>) => 
    apiClient.put<AlertRule>(`/alert-rules/${id}`, data),

  // 6. Rapports & Statistiques Zones
  // 6. Rapports & Statistiques Zones
  getZoneStats: (period: string = "30d") =>
    apiClient.get<ZoneStats[]>("/reports/zones/stats", { period }),
  getEvolutionData: (period: string = "30d", zoneId?: string) => 
    apiClient.get<EvolutionData[]>("/reports/evolution", { period, zoneId }),

  // 7. Tableau de performance
  getPerformance: () => apiClient.get<{ indicators: PerformanceIndicator[], ytdOutages: number, totalMinutesClient: number, globalScore: number }>("/performance"),

  // 8. Paramètres (Utilisateurs)
  getUsers: () => apiClient.get<User[]>("/users"),
  inviteUser: (email: string, role: UserRole) => 
    apiClient.post<User>("/users/invite", { email, role }),
  updateUserRole: (id: string, role: UserRole) => 
    apiClient.put<User>(`/users/${id}/role`, { role }),
    
  // 9. Configuration système
  getSystemConfig: () => apiClient.get<{ detectionDelayMinutes: number }>("/config/system"),
  updateSystemConfig: (data: { detectionDelayMinutes: number }) => 
    apiClient.put("/config/system", data),

  // 4. Interventions & Maintenance
  getInterventions: () => apiClient.get<MaintenanceIntervention[]>("/interventions"),

  updateIntervention: (id: string, data: Partial<MaintenanceIntervention>) =>
    apiClient.put<MaintenanceIntervention>(`/interventions/${id}`, data),

  deleteIntervention: (id: string) =>
    apiClient.delete<void>(`/interventions/${id}`),


   // 6. Rapports
  getZoneStats: (period: string = "30d") =>
    apiClient.get<ZoneReport[]>("/reports/zones/stats", { period }),

  getEvolutionData: (period: string = "30d", zoneId?: string) =>
    apiClient.get<EvolutionData[]>("/reports/evolution", { period, zoneId }),


};