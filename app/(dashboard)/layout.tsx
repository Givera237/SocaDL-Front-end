"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

// TODO: remplacer par l'utilisateur réel une fois l'authentification branchée
const CURRENT_USER = {
  email: "giveraango@gmail.com",
  role: "Administrateur" as const,
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar user={CURRENT_USER} onLogout={() => console.log("logout")} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}