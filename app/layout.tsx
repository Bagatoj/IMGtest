import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = { title: "IronMarkGear", description: "Site IronMarkGear" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body><LanguageProvider><ToastProvider>{children}</ToastProvider></LanguageProvider></body>
    </html>
  );
}
