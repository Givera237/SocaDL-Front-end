"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "offline" | "warning";
  weight: number;
  tensionV?: number;
  frequencyHz?: number;
  currentKa?: number;
  thdPct?: number;
  temperatureC?: number;
  loadPct?: number;
  lastUpdate?: Date | string | number;
}

interface SiteMapProps {
  sites: Site[];
  onSiteClick?: (siteId: string) => void;
}

const STATUS_COLORS: Record<Site["status"], string> = {
  online: "#10b981", // vert
  offline: "#ef4444", // rouge
  warning: "#f59e0b", // orange
};

// Icônes Leaflet personnalisées (cercles colorés)
function createMarkerIcon(status: Site["status"], weight: number) {
  const size = 16 + weight; // taille proportionnelle au poids

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${STATUS_COLORS[status]};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        cursor: pointer;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2],
  });
}

function StatusBadge({ status }: { status: Site["status"] }) {
  const styles: Record<Site["status"], string> = {
    online: "bg-[hsl(142_76%_96%)] text-[hsl(142_76%_36%)]",
    offline: "bg-[hsl(0_84%_96%)] text-[hsl(0_84%_60%)]",
    warning: "bg-[hsl(38_92%_95%)] text-[hsl(38_92%_40%)]",
  };

  const labels: Record<Site["status"], string> = {
    online: "En ligne",
    offline: "Hors ligne",
    warning: "Avertissement",
  };

  const dotStyles: Record<Site["status"], string> = {
    online: "bg-[hsl(142_76%_36%)]",
    offline: "bg-[hsl(0_84%_60%)]",
    warning: "bg-[hsl(38_92%_40%)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} />
      {labels[status]}
    </span>
  );
}

export function SiteMap({ sites, onSiteClick }: SiteMapProps) {
  const filteredSites = useMemo(() => sites, [sites]);

  return (
    <div className="h-[480px] w-full overflow-hidden rounded-xl border border-[#E8E2D8] bg-[hsl(40_44%_99%)]">
      <div className="flex items-center justify-between border-b border-[#E8E2D8] px-4 py-3">
        <h2 className="text-sm font-semibold text-[hsl(20_60%_20%)]">
          Carte du réseau
        </h2>
        <span className="text-xs text-[#8A8478]">
          {filteredSites.length} sites affichés
        </span>
      </div>

      <MapContainer
        center={[5.5, 11.5]}
        zoom={6}
        className="h-[calc(100%-49px)] w-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredSites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={createMarkerIcon(site.status, site.weight)}
            eventHandlers={{
              click: () => onSiteClick?.(site.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              <div className="min-w-[160px] space-y-1.5 font-sans">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[hsl(20_60%_20%)]">
                    {site.name}
                  </span>
                  <StatusBadge status={site.status} />
                </div>

                <div className="space-y-0.5 text-xs">
                  {site.tensionV !== undefined && (
                    <div className="flex justify-between gap-3">
                      <span className="text-[#8A8478]">Tension</span>
                      <span className="font-mono tabular-nums text-[#1F2937]">
                        {site.tensionV.toFixed(1)} V
                      </span>
                    </div>
                  )}
                  {site.frequencyHz !== undefined && (
                    <div className="flex justify-between gap-3">
                      <span className="text-[#8A8478]">Fréquence</span>
                      <span className="font-mono tabular-nums text-[#1F2937]">
                        {site.frequencyHz.toFixed(2)} Hz
                      </span>
                    </div>
                  )}
                  {site.loadPct !== undefined && (
                    <div className="flex justify-between gap-3">
                      <span className="text-[#8A8478]">Charge</span>
                      <span className="font-mono tabular-nums text-[#1F2937]">
                        {site.loadPct} %
                      </span>
                    </div>
                  )}
                </div>

                {onSiteClick && (
                  <div className="pt-1 text-[11px] font-medium text-[hsl(24_85%_50%)]">
                    Cliquer pour voir la fiche →
                  </div>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}