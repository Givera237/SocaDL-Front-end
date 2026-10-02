// services/index.ts
import { apiClient } from "@/lib/api-client";

// ==========================================
// TYPES (Calqués sur vos interfaces existantes)
// ==========================================

export type SiteStatus = "online" | "offline" | "maintenance";
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
}

export type EquipmentStatus = "operational" | "maintenance";
export interface Equipment {
  id: string;
  name: string;
  model: string;
  site: string;
  type: string;
  installDate: string; // Format: "DD/MM/YYYY" ou ISO
  age: number;         // en années
  lifespan: number;    // en années
  status: EquipmentStatus;
}

export type InterventionStatus = "open" | "in-progress" | "resolved" | "closed";
export interface InterventionTicket {
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

export type AlertCriterion = "THD" | "Tension" | "Fréquence" | "Puissance" | "Courant";
export type AlertScope = "global" | "site";
export type NotificationChannel = "SMS" | "Email" | "Console";
export interface AlertRule {
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

export interface ZoneStats {
  id: string;
  name: string;
  sites: number;
  subscribers: number;
  outages: number;
  saidi: number;   // min/abonné
  saifi: number;   // interruptions/abonné
  caidi: number;   // min/interruption
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
  getEquipment: () => apiClient.get<Equipment[]>("/equipment"),

  // 4. Fiches d'interventions
  getInterventions: () => apiClient.get<InterventionTicket[]>("/interventions"),
  updateIntervention: (id: string, data: Partial<InterventionTicket>) => 
    apiClient.put<InterventionTicket>(`/interventions/${id}`, data),

  // 5. Alertes
  getAlertRules: () => apiClient.get<AlertRule[]>("/alert-rules"),
  updateAlertRule: (id: string, data: Partial<AlertRule>) => 
    apiClient.put<AlertRule>(`/alert-rules/${id}`, data),

  // 6. Rapports & Statistiques Zones
  getZoneStats: (period: string = "30d") => 
    apiClient.get<ZoneStats[]>("/zones/stats", { period }),
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
};