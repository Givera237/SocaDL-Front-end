"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

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

export function useLiveTelemetry() {
  const [telemetryBySite, setTelemetryBySite] = useState<Record<string, LiveTelemetryView>>({});
  const [onlineBySite, setOnlineBySite] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const socket = getSocket();

    // 1. Log de statut de connexion au socket
    console.log("[useLiveTelemetry] Socket récupéré. Connecté ?", socket.connected);

    const onConnect = () => {
      console.log("🟢 [useLiveTelemetry] Client Socket.IO connecté au serveur ! ID:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.warn("🔴 [useLiveTelemetry] Client Socket.IO déconnecté :", reason);
    };

    // 2. Écoute de l'événement de télémétrie
    const onTelemetry = (data: any) => {
      // LOG TRÈS IMPORTANT : affiche la donnée brute venant du serveur
      console.log("📡 [WS Received - telemetry_update] :", data);

      const id = data.siteId || data.deviceId || data.device_id;
      if (!id) {
        console.error("⚠️ [telemetry_update] Aucun identifiant trouvé dans les données !", data);
        return;
      }

      const formattedData: LiveTelemetryView = {
        siteId: id,
        tensionV: data.tensionV ?? (data.voltage_kv !== undefined ? data.voltage_kv * 1000 : 0),
        frequencyHz: data.frequencyHz ?? data.frequency_hz ?? 0,
        currentKa: data.currentKa ?? data.current_ka ?? 0,
        thdPct: data.thdPct ?? data.thd_pct ?? 0,
        temperatureC: data.temperatureC ?? data.temperature_c ?? 0,
        loadPct: data.loadPct ?? data.load_pct ?? 0,
        timestamp: data.timestamp ? String(data.timestamp) : new Date().toISOString(),
      };

      console.log(`✅ [useLiveTelemetry] Enregistrement pour le site ${id} :`, formattedData);

      setTelemetryBySite((prev) => ({ ...prev, [id]: formattedData }));
    };

    // 3. Écoute des mises à jour de statut
    const onStatus = (data: any) => {
      console.log("🟢 [WS Received - status_update] :", data);

      const id = data.siteId || data.deviceId || data.device_id;
      if (!id) return;

      const isOnline = typeof data.online === "boolean" ? data.online : data.status === "ACTIVE";
      setOnlineBySite((prev) => ({ ...prev, [id]: isOnline }));
    };

    // Enregistrement des écouteurs
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("telemetry_update", onTelemetry);
    socket.on("status_update", onStatus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("telemetry_update", onTelemetry);
      socket.off("status_update", onStatus);
    };
  }, []);

  return { telemetryBySite, onlineBySite };
}