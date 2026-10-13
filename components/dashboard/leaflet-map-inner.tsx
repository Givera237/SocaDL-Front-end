"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Site, LeafletMapInnerProps } from "./map-types";

const STATUS_COLOR: Record<Site["status"], string> = {
  online: "#16A34A",
  warning: "#F2751F",
  offline: "#DC2626",
  maintenance: "#6B7280",
};

const STATUS_LABEL: Record<Site["status"], string> = {
  online: "En ligne",
  warning: "Avertissement",
  offline: "Hors ligne",
  maintenance: "Maintenance",
};

// Rayon proportionnel à la puissance/importance du site (bornes raisonnables)
function radiusFor(site: Site) {
  if (!site.weight) return 8;
  return Math.min(16, Math.max(6, site.weight));
}

function formatMetric(value: number | undefined, unit: string, decimals = 1) {
  return value === undefined ? "—" : `${value.toFixed(decimals)} ${unit}`;
}

export function LeafletMapInner({
  sites,
  center = [5.5, 12.7], // Centre approximatif du Cameroun
  zoom = 6,
}: LeafletMapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
    >
      {/* Tuiles OpenStreetMap — aucune clé API requise */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => (
        <CircleMarker
          key={site.id}
          center={[site.lat, site.lng]}
          radius={radiusFor(site)}
          pathOptions={{
            color: STATUS_COLOR[site.status],
            fillColor: STATUS_COLOR[site.status],
            fillOpacity: 0.75,
            weight: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <div className="min-w-[160px] text-xs">
              <p className="mb-1 font-semibold text-[13px]">{site.name}</p>
              <p className="mb-1" style={{ color: STATUS_COLOR[site.status] }}>
                ● {STATUS_LABEL[site.status]}
              </p>
              {site.lastUpdate === undefined ? (
                <p className="text-[#9A9284]">Pas encore de données live</p>
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[#4B5563]">
                  <span>Tension</span>
                  <span className="text-right font-medium">{formatMetric(site.tensionV, "V")}</span>
                  <span>Fréquence</span>
                  <span className="text-right font-medium">{formatMetric(site.frequencyHz, "Hz", 2)}</span>
                  <span>Courant</span>
                  <span className="text-right font-medium">{formatMetric(site.currentKa, "kA", 2)}</span>
                  <span>THD</span>
                  <span className="text-right font-medium">{formatMetric(site.thdPct, "%")}</span>
                  <span>Température</span>
                  <span className="text-right font-medium">{formatMetric(site.temperatureC, "°C", 0)}</span>
                  <span>Charge</span>
                  <span className="text-right font-medium">{formatMetric(site.loadPct, "%", 0)}</span>
                </div>
              )}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}