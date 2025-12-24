"use client";

import { useEffect, useRef, useState } from "react";

interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    title: string;
    label?: string;
}

interface DeliveryMapProps {
    markers: MarkerData[];
    center?: { lat: number; lng: number };
    zoom?: number;
}

export default function DeliveryMap({ markers, center = { lat: 33.4942, lng: -111.9261 }, zoom = 11 }: DeliveryMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const googleMapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
            return;
        }

        // Load Google Maps script
        if (!(window as any).google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        function initMap() {
            if (mapRef.current && !googleMapRef.current) {
                // @ts-ignore
                const newMap = new google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }],
                        },
                    ],
                });
                googleMapRef.current = newMap;
                setMap(newMap);
            }
        }
    }, [center, zoom]);

    useEffect(() => {
        if (!map) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // @ts-ignore
        const bounds = new google.maps.LatLngBounds();

        markers.forEach((m, index) => {
            // @ts-ignore
            const marker = new google.maps.Marker({
                position: { lat: m.lat, lng: m.lng },
                map,
                title: m.title,
                label: m.label || (index + 1).toString(),
                // @ts-ignore
                animation: google.maps.Animation.DROP
            });
            markersRef.current.push(marker);
            bounds.extend(marker.getPosition()!);
        });

        if (markers.length > 0) {
            map.fitBounds(bounds);
            // Don't zoom in too much if only 1 marker
            if (markers.length === 1) {
                map.setZoom(13);
            }
        }
    }, [map, markers]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
        />
    );
}
