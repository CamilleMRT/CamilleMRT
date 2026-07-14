import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { PwaRegister } from "@/components/PwaRegister";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"], // jamais 700
  variable: "--font-roboto",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carnet d'enquête",
  description: "Suivi d'un protocole digestif progressif",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Carnet" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0eeea" },
    { media: "(prefers-color-scheme: dark)", color: "#14171a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${roboto.variable} ${robotoMono.variable}`}>
      <body>
        <StoreProvider>
          <main className="mx-auto min-h-[100dvh] w-full max-w-[560px] px-4 pb-28 pt-6">
            {children}
          </main>
          <BottomNav />
          <PwaRegister />
        </StoreProvider>
      </body>
    </html>
  );
}
