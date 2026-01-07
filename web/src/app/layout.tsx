import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google"; // Changed from Outfit to Oswald for military look
import "./globals.css";

// Force dynamic rendering to ensure DB settings are checked on every request
export const dynamic = 'force-dynamic';

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liberty Meal Prep | Veteran Owned",
  description: "Chef-prepared healthy meals delivered to your door in Scottsdale, AZ. Veteran Owned & Operated.",
};

import { CartProvider } from "@/context/CartContext";
import SidebarCart from "@/components/SidebarCart";
import SessionProvider from "@/components/SessionProvider";
import ScrollProgress from "@/components/effects/ScrollProgress";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Suspense } from "react";
import MaintenanceGate from "@/components/MaintenanceGate";
import { getSystemSetting } from "@/actions/settings";
import { Toaster } from "sonner";




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch maintenance mode setting
  const maintenanceSetting = await getSystemSetting("maintenance_mode");
  const maintenanceEnabled = maintenanceSetting?.isEnabled || false;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <Toaster position="top-center" richColors theme="dark" />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ScrollProgress />
        <MaintenanceGate isEnabled={maintenanceEnabled}>
          <SessionProvider>
            <CartProvider>
              {children}
              <SidebarCart />
            </CartProvider>
          </SessionProvider>
        </MaintenanceGate>
      </body>
    </html>
  );
}
