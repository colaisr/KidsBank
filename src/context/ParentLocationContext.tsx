import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LatLng } from '../lib/parentLocation';

export type ParentLocationMode = 'live' | 'fallback';

type ParentLocationContextValue = {
  mode: ParentLocationMode;
  anchor: LatLng | null;
  childPosition: LatLng | null;
  setLiveFromPosition: (pos: GeolocationPosition) => void;
  setFallbackMode: () => void;
};

const ParentLocationContext = createContext<ParentLocationContextValue | null>(null);

export function ParentLocationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ParentLocationMode>('fallback');
  const [anchor, setAnchor] = useState<LatLng | null>(null);
  const [childPosition, setChildPosition] = useState<LatLng | null>(null);

  const setLiveFromPosition = useCallback((pos: GeolocationPosition) => {
    const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    setAnchor((prev) => prev ?? next);
    setChildPosition(next);
    setMode('live');
  }, []);

  const setFallbackMode = useCallback(() => {
    setMode('fallback');
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      setLiveFromPosition,
      setFallbackMode,
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 12_000 },
    );
  }, [setLiveFromPosition, setFallbackMode]);

  const value = useMemo(
    () => ({
      mode,
      anchor,
      childPosition,
      setLiveFromPosition,
      setFallbackMode,
    }),
    [mode, anchor, childPosition, setLiveFromPosition, setFallbackMode],
  );

  return (
    <ParentLocationContext.Provider value={value}>{children}</ParentLocationContext.Provider>
  );
}

export function useParentLocation() {
  const ctx = useContext(ParentLocationContext);
  if (!ctx) {
    throw new Error('useParentLocation must be used within ParentLocationProvider');
  }
  return ctx;
}

export function useWatchChildOnMap(active: boolean) {
  const { setLiveFromPosition, setFallbackMode } = useParentLocation();

  useEffect(() => {
    if (!active || !navigator.geolocation) {
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      setLiveFromPosition,
      setFallbackMode,
      { enableHighAccuracy: true, maximumAge: 10_000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [active, setLiveFromPosition, setFallbackMode]);
}
