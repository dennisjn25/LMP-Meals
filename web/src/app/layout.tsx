import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google"; // Changed from Outfit to Oswald for military look
import "./globals.css";

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

// ... existing imports



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ScrollProgress />
        <SessionProvider>
          <CartProvider>
            {children}
            <SidebarCart />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
