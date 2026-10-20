// lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://socadel-back-end.onrender.com";
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    console.log("[Socket] Initialisation du socket vers :", SOCKET_URL);

    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      withCredentials: true,
    });

    // --- LOGS DE CONNEXION ---
    socket.on("connect", () => {
      console.log("[Socket] Connecté avec succès ! ID :", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Erreur de connexion :", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket] Déconnecté. Raison :", reason);
    });

    // Optionnel : écouter les tentatives de reconnexion
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`[Socket] Tentative de reconnexion #${attempt}`);
    });
  }

  return socket;
}