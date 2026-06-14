"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LatLng } from "@/lib/types";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  emoji?: string;
};

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/**
 * Read-only map that plots markers. Leaflet is imported dynamically so it never
 * runs during SSR (it touches `window` at runtime).
 */
export function MapView({
  center,
  zoom = 14,
  markers = [],
  height = 320,
  onMarkerClick,
}: {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  height?: number;
  onMarkerClick?: (id: string) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const clickRef = useRef(onMarkerClick);
  clickRef.current = onMarkerClick;

  // Init once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod: any = await import("leaflet");
      const L = mod.default ?? mod;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(elRef.current, { scrollWheelZoom: false }).setView(
        [center.lat, center.lng],
        zoom
      );
      L.tileLayer(TILE_URL, { attribution: ATTRIB, maxZoom: 19 }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      drawMarkers();
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when center/zoom change.
  useEffect(() => {
    if (mapRef.current) mapRef.current.setView([center.lat, center.lng], zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom]);

  // Redraw markers when they change.
  useEffect(() => {
    drawMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function drawMarkers() {
    const L = LRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();
    markers.forEach((m) => {
      const icon = L.divIcon({
        className: "btc-danggn-pin",
        html: `<div style="font-size:26px;line-height:1;transform:translate(-50%,-100%)">${
          m.emoji ?? "📍"
        }</div>`,
        iconSize: [0, 0],
      });
      const marker = L.marker([m.lat, m.lng], { icon });
      if (m.label) marker.bindPopup(m.label);
      if (clickRef.current) marker.on("click", () => clickRef.current?.(m.id));
      marker.addTo(layer);
    });
  }

  return (
    <div
      ref={elRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-xl border border-gray-200"
    />
  );
}
