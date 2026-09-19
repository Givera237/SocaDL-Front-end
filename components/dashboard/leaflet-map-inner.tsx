"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Site, LeafletMapInnerProps } from "./map-types";

const STATUS_COLOR: Record<Site["status"], string> = {
  online: "#16A34A",
  offline: "#DC2626",
  warning: "#F2751F",
};

// Rayon proportionnel à la puissance/importance du site (bornes raisonnables)
function radiusFor(site: Site) {
  if (!site.weight) return 8;
  return Math.min(16, Math.max(6, site.weight));
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
            <span className="text-xs font-medium">{site.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}