// lib/api-client.ts
// lib/api-client.ts

// Mettez le port exact sur lequel NestJS tourne (ex: 3001)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur API sur ${endpoint}: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Si NestJS renvoie directement le tableau / objet, on le retourne.
    // S'il est enveloppé dans un Interceptor { success, data }, on retourne result.data.
    return result.data !== undefined ? result.data : result;
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Erreur API sur ${endpoint}: ${response.status}`);
    const result = await response.json();
    return result.data !== undefined ? result.data : result;
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    const result = await response.json();
    return result.data !== undefined ? result.data : result;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    const result = await response.json();
    return result.data !== undefined ? result.data : result;
  },
};