import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import type { DemoSavedPlace, DemoTransaction } from '../data/demoBaseline';
import type { LatLng } from '../lib/parentLocation';
import { resolvePlacePosition } from '../lib/parentLocation';

import 'leaflet/dist/leaflet.css';

type ParentGeolocationMapProps = {
  mode: 'live' | 'fallback';
  anchor: LatLng | null;
  childPosition: LatLng;
  mapTagLabel: string;
  childInitial: string;
  savedPlaces: DemoSavedPlace[];
  spendMarkers: Array<{ tx: DemoTransaction; position: LatLng }>;
  focusPosition: LatLng | null;
  onSpendClick: (tx: DemoTransaction) => void;
};

function FlyTo({ position }: { position: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (!position) {
      return;
    }
    map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 16), { duration: 0.6 });
  }, [map, position?.lat, position?.lng, position]);
  return null;
}

function childMarkerIcon(initial: string, tagLabel: string) {
  return L.divIcon({
    className: 'kb-map-marker-root',
    html: `<div class="kb-map-child-marker">
      <div class="kb-map-child-tag"><span class="kb-map-live-dot"></span>${tagLabel}</div>
      <div class="kb-map-child-pin"><span>${initial}</span></div>
    </div>`,
    iconSize: [120, 72],
    iconAnchor: [60, 56],
  });
}

function spendMarkerIcon(kind: 'shop' | 'cafe') {
  const inner = kind === 'cafe' ? '🛒' : '▦';
  return L.divIcon({
    className: 'kb-map-marker-root',
    html: `<div class="kb-map-spend-marker">${inner}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function savedPlaceIcon() {
  return L.divIcon({
    className: 'kb-map-marker-root',
    html: `<div class="kb-map-place-marker"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function ParentGeolocationMap({
  mode,
  anchor,
  childPosition,
  mapTagLabel,
  childInitial,
  savedPlaces,
  spendMarkers,
  focusPosition,
  onSpendClick,
}: ParentGeolocationMapProps) {
  const placePositions = useMemo(
    () =>
      savedPlaces.map((place) => ({
        place,
        position: resolvePlacePosition(place, mode, anchor),
      })),
    [savedPlaces, mode, anchor],
  );

  return (
    <MapContainer
      center={[childPosition.lat, childPosition.lng]}
      zoom={16}
      className="h-full w-full"
      scrollWheelZoom
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FlyTo position={focusPosition} />
      <Marker
        position={[childPosition.lat, childPosition.lng]}
        icon={childMarkerIcon(childInitial, mapTagLabel)}
        zIndexOffset={1000}
      />
      {placePositions.map(({ place, position }) => (
        <Marker
          key={place.id}
          position={[position.lat, position.lng]}
          icon={savedPlaceIcon()}
          opacity={0.85}
        />
      ))}
      {spendMarkers.map(({ tx, position }) => (
        <Marker
          key={tx.id}
          position={[position.lat, position.lng]}
          icon={spendMarkerIcon(tx.merchantKey === 'cafe' ? 'cafe' : 'shop')}
          eventHandlers={{
            click: () => onSpendClick(tx),
          }}
        />
      ))}
    </MapContainer>
  );
}
