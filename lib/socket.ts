import { io, Socket } from "socket.io-client";

// NEXT_PUBLIC_SOCKET_URL : URL du backend NestJS (ex. http://localhost:3001
// en local, https://votre-backend.onrender.com une fois déployé). Doit être
// préfixée NEXT_PUBLIC_ pour être accessible côté client dans Next.js.
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket | null = null;

/**
 * Singleton : une seule connexion WebSocket partagée par toute l'app,
 * créée au premier appel plutôt qu'à chaque montage de composant.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}