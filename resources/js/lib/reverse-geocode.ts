export interface GeocodeSuggestion {
    label: string;
    display_name: string;
    lat: number;
    lon: number;
}

/**
 * Compute distance in meters between two GPS coordinates.
 */
export function haversineMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Resolve latitude/longitude into a readable Indonesian street address via Laravel proxy.
 */
export async function reverseGeocodeCoords(
    lat: number,
    lon: number,
    signal?: AbortSignal,
): Promise<string> {
    try {
        const res = await fetch(
            `/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
            {
                signal,
                headers: { Accept: 'application/json' },
            },
        );

        if (res.ok) {
            const payload = (await res.json()) as { address?: string };
            if (payload.address) return payload.address;
        }
    } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            throw err;
        }
    }

    return `Lokasi GPS (${lat.toFixed(6)}, ${lon.toFixed(6)})`;
}

/**
 * Search Indonesian addresses/landmarks via Laravel proxy.
 */
export async function searchIndonesianAddresses(
    query: string,
    signal?: AbortSignal,
): Promise<GeocodeSuggestion[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    try {
        const res = await fetch(
            `/api/geocode/search?q=${encodeURIComponent(trimmed)}`,
            {
                signal,
                headers: { Accept: 'application/json' },
            },
        );
        if (!res.ok) return [];
        const payload = (await res.json()) as { results?: GeocodeSuggestion[] };
        return payload.results ?? [];
    } catch {
        return [];
    }
}
