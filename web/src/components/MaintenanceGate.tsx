"use client";

import { usePathname } from "next/navigation";
import UnderConstruction from "./UnderConstruction";

interface MaintenanceGateProps {
    children: React.ReactNode;
    isEnabled: boolean;
}

export default function MaintenanceGate({ children, isEnabled }: MaintenanceGateProps) {
    const pathname = usePathname();

    // List of paths that are ALWAYS allowed, even in maintenance mode
    const allowedPrefixes = [
        "/admin",   // Admin panel
        "/auth",    // Authentication (signin, signout)
        "/api",     // API routes (needed for auth/functions)
        "/_next",   // Next.js resources (scripts, css)
        "/static",  // Static folder
        "/favicon"  // Favicon
    ];

    const isAllowed = allowedPrefixes.some(prefix => pathname?.startsWith(prefix));

    // If maintenance is ON and the current path is NOT allowed, show the construction page
    if (isEnabled && !isAllowed) {
        return <UnderConstruction />;
    }

    // Otherwise, render the normal site content
    return <>{children}</>;
}
