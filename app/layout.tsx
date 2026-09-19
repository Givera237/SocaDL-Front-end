import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOCADL - Supervision Réseau",
  description: "Plateforme de supervision temps réel du réseau de distribution électrique",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
