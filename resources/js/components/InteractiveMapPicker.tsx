import React, { useRef, useState } from 'react';
import { Loader2, MapPin, Minus, Plus, Search } from 'lucide-react';
import { searchIndonesianAddresses, type GeocodeSuggestion } from '@/lib/reverse-geocode';

interface InteractiveMapPickerProps {
    lat: number;
    lon: number;
    accuracy?: number;
    isLoadingAddress?: boolean;
    onSelectLocation: (lat: number, lon: number, prefilledAddress?: string) => void;
}

const TILE_SIZE = 256;
const MIN_ZOOM = 5;
const MAX_ZOOM = 18;

function latLonToWorldPixel(lat: number, lon: number, zoom: number): { x: number; y: number } {
    const scale = TILE_SIZE * 2 ** zoom;
    const sinLat = Math.sin((Math.max(-85, Math.min(85, lat)) * Math.PI) / 180);
    const x = ((lon + 180) / 360) * scale;
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
    return { x, y };
}

function worldPixelToLatLon(x: number, y: number, zoom: number): { lat: number; lon: number } {
    const scale = TILE_SIZE * 2 ** zoom;
    const lon = (x / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / scale;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return {
        lat: Math.max(-85, Math.min(85, lat)),
        lon: Math.max(-180, Math.min(180, lon)),
    };
}

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
    lat,
    lon,
    accuracy,
    isLoadingAddress = false,
    onSelectLocation,
}) => {
    const [zoom, setZoom] = useState(16);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
    const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);
    const dragStartRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const centerPixel = latLonToWorldPixel(lat, lon, zoom);
    const effectiveCenterX = centerPixel.x - (dragOffset?.dx ?? 0);
    const effectiveCenterY = centerPixel.y - (dragOffset?.dy ?? 0);

    const centerTileX = Math.floor(effectiveCenterX / TILE_SIZE);
    const centerTileY = Math.floor(effectiveCenterY / TILE_SIZE);
    const offsetInTileX = effectiveCenterX - centerTileX * TILE_SIZE;
    const offsetInTileY = effectiveCenterY - centerTileY * TILE_SIZE;
    const maxTileIndex = 2 ** zoom;

    const tiles: { key: string; url: string; dx: number; dy: number }[] = [];
    for (let tx = -1; tx <= 1; tx++) {
        for (let ty = -1; ty <= 1; ty++) {
            const tileX = ((centerTileX + tx) % maxTileIndex + maxTileIndex) % maxTileIndex;
            const tileY = centerTileY + ty;
            if (tileY < 0 || tileY >= maxTileIndex) continue;
            tiles.push({
                key: `${zoom}-${tileX}-${tileY}`,
                url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
                dx: tx * TILE_SIZE - offsetInTileX,
                dy: ty * TILE_SIZE - offsetInTileY,
            });
        }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
        setDragOffset({ dx: 0, dy: 0 });
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragStartRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            dragStartRef.current.moved = true;
        }
        setDragOffset({ dx, dy });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragStartRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const wasDragged = dragStartRef.current.moved;
        dragStartRef.current = null;
        setDragOffset(null);

        if (wasDragged) {
            const next = worldPixelToLatLon(centerPixel.x - dx, centerPixel.y - dy, zoom);
            onSelectLocation(next.lat, next.lon);
            return;
        }

        // Single click places the pin at clicked spot
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const clickOffsetX = e.clientX - (rect.left + rect.width / 2);
            const clickOffsetY = e.clientY - (rect.top + rect.height / 2);
            const next = worldPixelToLatLon(
                centerPixel.x + clickOffsetX,
                centerPixel.y + clickOffsetY,
                zoom
            );
            onSelectLocation(next.lat, next.lon);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim().length < 2) return;
        setSearching(true);
        const found = await searchIndonesianAddresses(searchQuery);
        setSuggestions(found);
        setSearching(false);
    };

    const isCoarseEstimate = typeof accuracy === 'number' && accuracy > 250;

    return (
        <div className="mt-2 rounded-xl border border-[#D8CEBA] bg-[#FFFFFF] overflow-hidden shadow-xs">
            {/* Search Address Bar */}
            <div className="p-2.5 bg-[#EAE1CE]/55 border-b border-[#D8CEBA]">
                <div className="flex gap-1.5">
                    <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-[#6E675D] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    void handleSearch();
                                }
                            }}
                            placeholder="Cari nama jalan, perumahan, kecamatan, atau kota..."
                            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D8CEBA] text-xs text-[#1E2430] placeholder:text-[#6E675D] focus:outline-none focus:ring-2 focus:ring-[#A88B54]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleSearch()}
                        disabled={searching || searchQuery.trim().length < 2}
                        className="px-3 py-1.5 rounded-lg bg-[#16233B] text-[#F2EBDC] text-xs font-semibold hover:bg-[#203252] disabled:opacity-50 cursor-pointer shrink-0 inline-flex items-center gap-1"
                    >
                        {searching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Cari'}
                    </button>
                </div>

                {suggestions.length > 0 && (
                    <ul className="mt-1.5 max-h-36 overflow-y-auto rounded-lg border border-[#D8CEBA] bg-[#FFFFFF] divide-y divide-[#EAE1CE]">
                        {suggestions.map((item, idx) => (
                            <li key={`${item.lat}-${item.lon}-${idx}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectLocation(item.lat, item.lon, item.label);
                                        setZoom(17);
                                        setSuggestions([]);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-left text-[11px] text-[#1E2430] hover:bg-[#EAE1CE]/60 flex items-start gap-1.5 cursor-pointer"
                                >
                                    <MapPin className="w-3 h-3 text-[#725C30] shrink-0 mt-0.5" />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Coarse IP Warning */}
            {isCoarseEstimate && (
                <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900">
                    Perkiraan lokasi browser berjarak ±
                    {accuracy >= 1000 ? `${(accuracy / 1000).toFixed(1)} km` : `${accuracy} m`} (jaringan/IP
                    komputer). Klik atau geser peta ke titik tepat Anda.
                </div>
            )}

            {/* Slippy OSM Map Canvas */}
            <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative h-48 w-full overflow-hidden bg-[#EAE1CE] cursor-grab active:cursor-grabbing touch-none select-none"
                title="Klik atau geser peta untuk menentukan titik pengiriman"
            >
                {tiles.map((tile) => (
                    <img
                        key={tile.key}
                        src={tile.url}
                        alt=""
                        draggable={false}
                        className="absolute w-64 h-64 max-w-none pointer-events-none"
                        style={{
                            left: `calc(50% + ${tile.dx}px)`,
                            top: `calc(50% + ${tile.dy}px)`,
                        }}
                    />
                ))}

                {/* Center Pin */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-[#16233B] border-2 border-[#C5AA74] shadow-lg flex items-center justify-center text-[#C5AA74]">
                        {isLoadingAddress ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <MapPin className="w-4 h-4" />
                        )}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#16233B]/40 -mt-0.5" />
                </div>

                {/* Zoom Controls */}
                <div className="absolute right-2.5 top-2.5 z-10 flex flex-col rounded-lg border border-[#D8CEBA] bg-[#FFFFFF]/95 shadow-xs overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))}
                        className="p-1.5 text-[#16233B] hover:bg-[#EAE1CE] cursor-pointer"
                        aria-label="Perbesar peta"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1))}
                        className="p-1.5 border-t border-[#D8CEBA] text-[#16233B] hover:bg-[#EAE1CE] cursor-pointer"
                        aria-label="Perkecil peta"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Attribution */}
                <div className="absolute left-2 bottom-1.5 z-10 rounded bg-[#FFFFFF]/85 px-1.5 py-0.5 text-[10px] text-[#6E675D] pointer-events-none">
                    Geser / klik peta untuk geser pin • © OpenStreetMap
                </div>
            </div>
        </div>
    );
};
