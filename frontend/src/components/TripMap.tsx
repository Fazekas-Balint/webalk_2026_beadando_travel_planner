import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import type { Activity } from '../types';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function makeNumberedIcon(n: number): L.DivIcon {
  return L.divIcon({
    className: 'tp-marker',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background:#D2691E;color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${n}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

type Props = {
  activities: Activity[];
};

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

export function TripMap({ activities }: Props) {
  const located = useMemo(
    () => activities.filter((a): a is Activity & { lat: number; lng: number } => a.lat != null && a.lng != null),
    [activities]
  );
  const points: [number, number][] = located.map((a) => [a.lat, a.lng]);

  if (located.length === 0) {
    return (
      <div className="grid h-full min-h-[400px] place-items-center rounded-2xl border border-dashed border-border bg-bg p-8 text-center text-ink-muted">
        <div>
          <p className="font-medium text-ink">Nincs még helyszín a térképen</p>
          <p className="mt-1 text-sm">Adj hozzá egy programot koordinátákkal — itt jelenik meg a térképen.</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={points[0]}
      zoom={13}
      scrollWheelZoom
      className="h-full min-h-[400px] w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      <Polyline positions={points} pathOptions={{ color: '#D2691E', weight: 3, opacity: 0.6, dashArray: '6 8' }} />
      {located.map((a, i) => (
        <Marker key={a.id} position={[a.lat, a.lng]} icon={makeNumberedIcon(i + 1)}>
          <Popup>
            <div className="font-medium">{a.title}</div>
            {a.address && <div className="text-xs text-ink-muted">{a.address}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
