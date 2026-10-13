"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

// Forme exacte émise par TelemetryGateway.broadcastTelemetry côté backend
// (voir telemetry.mapper.ts) — à garder synchronisée si le backend change.
export interface LiveTelemetryView {
  siteId: string;
  tensionV: number;
  frequencyHz: number;
  currentKa: number;
  thdPct: number;
  temperatureC: number;
  loadPct: number;
  timestamp: string;
}

export type StatusUpdate = { siteId: string; online: boolean };

/**
 * S'abonne au WebSocket du backend et garde la dernière mesure reçue pour
 * chaque site. Se reconnecte automatiquement (géré par socket.io-client) ;
 * un site jamais vu n'a simplement pas d'entrée dans le record retourné.
 */
export function useLiveTelemetry() {
  const [telemetryBySite, setTelemetryBySite] = useState<Record<string, LiveTelemetryView>>({});
  const [onlineBySite, setOnlineBySite] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const socket = getSocket();

    const onTelemetry = (data: LiveTelemetryView) => {
      setTelemetryBySite((prev) => ({ ...prev, [data.siteId]: data }));
    };
    const onStatus = (data: StatusUpdate) => {
      setOnlineBySite((prev) => ({ ...prev, [data.siteId]: data.online }));
    };

    socket.on("telemetry_update", onTelemetry);
    socket.on("status_update", onStatus);

    return () => {
      socket.off("telemetry_update", onTelemetry);
      socket.off("status_update", onStatus);
    };
  }, []);

  return { telemetryBySite, onlineBySite };
}