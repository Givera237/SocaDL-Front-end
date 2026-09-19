"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { Site, LeafletMapInnerProps } from "./map-types";

export type { Site } from "./map-types";

const LeafletMapInner = dynamic<LeafletMapInnerProps>(
  () => import("./leaflet-map-inner").then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#F5F2EC] text-sm text-[#9A9284]">
        Chargement de la carte…
      </div>
    ),
  }
);

export function SiteMap({ sites }: { sites: Site[] }) {
  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#8A8478]" />
          <p className="text-sm font-semibold text-[#1F2937]">Carte du réseau</p>
        </div>
        <p className="text-xs text-[#9A9284]">{sites.length} sites affichés</p>
      </div>
      <div className="h-[340px] w-full overflow-hidden rounded-lg">
        <LeafletMapInner sites={sites} />
      </div>
    </div>
  );
}