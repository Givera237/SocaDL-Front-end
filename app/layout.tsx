import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
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
      <body>
        <NextTopLoader color="hsl(24 85% 50%)" height={3} showSpinner={false} />
        {children}
      </body>
    </html>
  );
}