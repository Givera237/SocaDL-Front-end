export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "warning" | "offline" | "maintenance";
  weight: number;
  // ── Télémétrie live (optionnelle — absente tant que le WebSocket n'a pas
  // encore reçu de message pour ce site, ex. site mocké jamais branché) ──
  tensionV?: number;
  frequencyHz?: number;
  currentKa?: number;
  thdPct?: number;
  temperatureC?: number;
  loadPct?: number;
  lastUpdate?: string; // ISO 8601
}

export interface LeafletMapInnerProps {
  sites: Site[];
  center?: [number, number];
  zoom?: number;
}