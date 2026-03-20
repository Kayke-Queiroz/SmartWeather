import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Vite/React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { animate: true, duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

interface WeatherMapProps {
    lat: number;
    lon: number;
    locationName: string;
}

export default function WeatherMap({ lat, lon, locationName }: WeatherMapProps) {
    const position: [number, number] = [lat, lon];

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 z-0 relative">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <ChangeView center={position} zoom={13} />
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    className="map-tiles"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-center p-1">
                            <p className="font-semibold text-slate-800 text-sm">{locationName}</p>
                            <p className="text-xs text-slate-500 mt-1">Weather Location</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
