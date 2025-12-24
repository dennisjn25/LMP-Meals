"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/actions/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        // Use a small delay to ensure page is loaded or just fire it
        trackPageView(url, document.referrer);
    }, [pathname, searchParams]);

    return null;
}
