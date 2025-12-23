export async function geocodeAddress(address: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.warn("GOOGLE_MAPS_API_KEY is missing");
        return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK" && data.results && data.results[0]) {
            return {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
                formattedAddress: data.results[0].formatted_address
            };
        }
    } catch (e) {
        console.error("Geocoding error:", e);
    }
    return null;
}

export async function calculateOptimizedRoute(origins: { lat: number, lng: number }[], destination: { lat: number, lng: number }) {
    // This would ideally use Google Routes API (Routes Preferred)
    // For now, we return the inputs as a sequence
    return origins.map((o, i) => ({ ...o, sequence: i }));
}
