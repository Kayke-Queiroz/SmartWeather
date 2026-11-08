import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.DivIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative flex items-center justify-center w-10 h-10 -m-5">
             <div class="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
             <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff" stroke="none"/></svg>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    popupAnchor: [0, -36],
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { animate: true, duration: 1.2 });
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [center, zoom, map]);
    return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lon: number) => void }) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            if (onClick) {
                onClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

interface WeatherMapProps {
    lat: number;
    lon: number;
    locationName: string;
    onMapClick?: (lat: number, lon: number) => void;
}

export default function WeatherMap({ lat, lon, locationName, onMapClick }: WeatherMapProps) {
    const markerRef = useRef<L.Marker>(null);
    const markerPos: [number, number] = [lat, lon];

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat: newLat, lng: newLng } = marker.getLatLng();
                    if (onMapClick) onMapClick(newLat, newLng);
                }
            },
        }),
        [onMapClick]
    );

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-white/40 z-0 relative">
            <MapContainer
                key={`${lat}-${lon}`}
                center={markerPos}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <ChangeView center={markerPos} zoom={12} />
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    className="map-tiles"
                />
                <MapClickHandler
                    onClick={(clickLat, clickLon) => {
                        if (onMapClick) onMapClick(clickLat, clickLon);
                    }}
                />
                <Marker
                    position={markerPos}
                    icon={customIcon}
                    draggable={true}
                    eventHandlers={eventHandlers}
                    ref={markerRef}
                >
                    <Popup>
                        <div className="text-center p-1">
                            <p className="font-semibold text-slate-800 text-sm">{locationName}</p>
                            <p className="text-xs text-slate-500 mt-1">Lat: {markerPos[0].toFixed(2)}, Lon: {markerPos[1].toFixed(2)}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
