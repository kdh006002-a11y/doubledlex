"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LatLng } from "@/lib/types";
import { DEFAULT_CENTER } from "@/lib/seed";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Tap the map to choose a 거래 위치. Also supports "현재 위치". */
export function MapPicker({
  value,
  onChange,
  height = 280,
  defaultCenter = DEFAULT_CENTER,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
  height?: number;
  defaultCenter?: LatLng;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod: any = await import("leaflet");
      const L = mod.default ?? mod;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;
      const start = value ?? defaultCenter;
      const map = L.map(elRef.current).setView([start.lat, start.lng], 15);
      L.tileLayer(TILE_URL, { attribution: ATTRIB, maxZoom: 19 }).addTo(map);
      mapRef.current = map;
      if (value) setMarker(value);
      map.on("click", (e: any) => {
        const v = { lat: e.latlng.lat, lng: e.latlng.lng };
        setMarker(v);
        onChangeRef.current(v);
      });
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

  // Reflect external value changes (e.g. geolocation button).
  useEffect(() => {
    if (value) {
      setMarker(value);
      if (mapRef.current) mapRef.current.setView([value.lat, value.lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.lat, value?.lng]);

  function setMarker(v: LatLng) {
    const L = LRef.current;
    if (!L || !mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([v.lat, v.lng]);
    } else {
      const icon = L.divIcon({
        className: "btc-danggn-pin",
        html: `<div style="font-size:30px;line-height:1;transform:translate(-50%,-100%)">📍</div>`,
        iconSize: [0, 0],
      });
      markerRef.current = L.marker([v.lat, v.lng], { icon }).addTo(mapRef.current);
    }
  }

  function useHere() {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 기능을 지원하지 않아요");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        onChangeRef.current({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => alert("위치 권한을 가져올 수 없어요")
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={elRef}
        style={{ height }}
        className="w-full overflow-hidden rounded-xl border border-gray-200"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={useHere}
          className="text-xs font-medium text-brand underline"
        >
          📍 현재 위치로 설정
        </button>
        <span className="text-[11px] text-gray-400">지도를 탭해서 거래 위치를 선택하세요</span>
      </div>
    </div>
  );
}
