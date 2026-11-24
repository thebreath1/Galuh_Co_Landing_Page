<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    private const USER_AGENT = 'GaluhCoHampers/1.0 (hello@galuh.co.id)';

    /**
     * Reverse geocode latitude/longitude into a detailed Indonesian address.
     */
    public function reverse(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lon' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $lat = (float) $validated['lat'];
        $lon = (float) $validated['lon'];

        try {
            $response = Http::timeout(6)
                ->withHeaders([
                    'User-Agent' => self::USER_AGENT,
                    'Accept' => 'application/json',
                    'Accept-Language' => 'id-ID,id;q=0.9',
                ])
                ->get('https://nominatim.openstreetmap.org/reverse', [
                    'format' => 'jsonv2',
                    'lat' => $lat,
                    'lon' => $lon,
                    'zoom' => 18,
                    'addressdetails' => 1,
                    'accept-language' => 'id',
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $formatted = $this->formatAddress($data['address'] ?? null, $data['display_name'] ?? null);
                if ($formatted !== '') {
                    return response()->json([
                        'address' => $formatted,
                        'lat' => $lat,
                        'lon' => $lon,
                        'provider' => 'nominatim',
                    ]);
                }
            }
        } catch (\Throwable) {
            // Fall through to secondary geocoding service
        }

        try {
            $fallback = Http::timeout(6)->get('https://api.bigdatacloud.net/data/reverse-geocode-client', [
                'latitude' => $lat,
                'longitude' => $lon,
                'localityLanguage' => 'id',
            ]);

            if ($fallback->successful()) {
                $json = $fallback->json();
                $parts = array_values(array_unique(array_filter([
                    $json['locality'] ?? null,
                    $json['city'] ?? null,
                    $json['principalSubdivision'] ?? null,
                    $json['postcode'] ?? null,
                ])));

                if ($parts !== []) {
                    return response()->json([
                        'address' => implode(', ', $parts),
                        'lat' => $lat,
                        'lon' => $lon,
                        'provider' => 'bigdatacloud',
                    ]);
                }
            }
        } catch (\Throwable) {
            // Fall through to raw coordinates
        }

        return response()->json([
            'address' => sprintf('Lokasi GPS (%.6f, %.6f)', $lat, $lon),
            'lat' => $lat,
            'lon' => $lon,
            'provider' => 'coordinates',
        ]);
    }

    /**
     * Search Indonesian addresses and landmarks for pinpoint autocomplete.
     */
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:200'],
        ]);

        try {
            $response = Http::timeout(6)
                ->withHeaders([
                    'User-Agent' => self::USER_AGENT,
                    'Accept' => 'application/json',
                    'Accept-Language' => 'id-ID,id;q=0.9',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'jsonv2',
                    'q' => $validated['q'],
                    'countrycodes' => 'id',
                    'addressdetails' => 1,
                    'limit' => 5,
                    'accept-language' => 'id',
                ]);

            if ($response->successful()) {
                $results = collect($response->json() ?? [])->map(function (array $item) {
                    $formatted = $this->formatAddress($item['address'] ?? null, $item['display_name'] ?? null);

                    return [
                        'label' => $formatted !== '' ? $formatted : ($item['display_name'] ?? ''),
                        'display_name' => $item['display_name'] ?? '',
                        'lat' => (float) ($item['lat'] ?? 0),
                        'lon' => (float) ($item['lon'] ?? 0),
                    ];
                })->filter(fn (array $item) => $item['label'] !== '')->values();

                return response()->json(['results' => $results]);
            }
        } catch (\Throwable) {
            // Return empty suggestions safely
        }

        return response()->json(['results' => []]);
    }

    /**
     * Format OSM address components in natural Indonesian order.
     *
     * @param  array<string, mixed>|null  $addr
     */
    private function formatAddress(?array $addr, ?string $displayName): string
    {
        if (! is_array($addr) || $addr === []) {
            return trim((string) $displayName);
        }

        $road = $addr['road']
            ?? $addr['pedestrian']
            ?? $addr['residential']
            ?? $addr['footway']
            ?? $addr['path']
            ?? $addr['amenity']
            ?? $addr['building']
            ?? null;
        $houseNumber = $addr['house_number'] ?? null;
        $street = $road && $houseNumber ? "{$road} No. {$houseNumber}" : $road;

        $village = $addr['neighbourhood']
            ?? $addr['quarter']
            ?? $addr['hamlet']
            ?? $addr['village']
            ?? $addr['suburb']
            ?? null;

        $district = $addr['city_district']
            ?? $addr['district']
            ?? $addr['subdistrict']
            ?? $addr['municipality']
            ?? null;

        $city = $addr['city']
            ?? $addr['town']
            ?? $addr['county']
            ?? $addr['regency']
            ?? $addr['state_district']
            ?? null;

        $state = $addr['state'] ?? null;
        $postcode = $addr['postcode'] ?? null;
        $region = trim(implode(' ', array_filter([$state, $postcode])));

        $parts = [];
        foreach ([$street, $village, $district, $city, $region] as $part) {
            $clean = is_string($part) ? trim($part) : '';
            if ($clean !== '' && ! in_array($clean, $parts, true)) {
                $parts[] = $clean;
            }
        }

        return $parts !== [] ? implode(', ', $parts) : trim((string) $displayName);
    }
}
