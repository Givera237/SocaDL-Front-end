"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { LeafletMapInnerProps } from "./map-types";
import type { Site } from "./map-types";

export type { Site } from "./map-types";

interface SiteMapProps {
  sites: Site[];
  onSiteClick?: (siteId: string) => void;
  center?: [number, number];
  zoom?: number;
}

// Leaflet accède à `window` : chargement côté client uniquement (ssr: false)
const LeafletMapInner = dynamic(
  () => import("./leaflet-map-inner").then((m) => m.default),
  { ssr: false }
);

export function SiteMap({ sites, onSiteClick, center, zoom }: SiteMapProps) {
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

      <div className="h-[calc(100%-49px)] w-full">
        <LeafletMapInner
          sites={filteredSites}
          center={center}
          zoom={zoom}
        />
      </div>
    </div>
  );
}
