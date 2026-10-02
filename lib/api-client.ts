// lib/api-client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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
        // Décommentez la ligne suivante si votre API nécessite un token JWT
        // "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      cache: "no-store", // Empêche le cache Next.js pour avoir des données temps réel
    });

    if (!response.ok) {
      throw new Error(`Erreur API sur ${endpoint}: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erreur API sur ${endpoint}: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return (await response.json()).data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return (await response.json()).data;
  },
};