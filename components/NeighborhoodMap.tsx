"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { formatKrw } from "@/lib/format";

export interface MapItem {
  id: string;
  title: string;
  emoji: string;
  priceKrw: number;
  location: string;
  lat: number;
  lng: number;
}

/** 이모지 핀 (기본 마커 이미지 대신 divIcon → 별도 에셋 불필요) */
function pinIcon(emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div class="dd-pin">${emoji}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

/** center/zoom 이 바뀌면 부드럽게 이동 */
function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.6 });
  }, [map, center, zoom]);
  return null;
}

export default function NeighborhoodMap({
  items,
  center,
  zoom = 13,
}: {
  items: MapItem[];
  center: [number, number];
  zoom?: number;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />
      {items.map((it) => (
        <Marker key={it.id} position={[it.lat, it.lng]} icon={pinIcon(it.emoji)}>
          <Popup>
            <div className="min-w-[160px]">
              <div className="text-sm font-semibold leading-snug">{it.title}</div>
              <div className="tnum mt-1 font-bold text-[var(--primary)]">
                {formatKrw(it.priceKrw)}
              </div>
              <div className="mt-0.5 text-xs text-ink-muted">📍 {it.location}</div>
              <Link
                href={`/products/${it.id}`}
                className="mt-2 inline-block text-sm font-semibold text-[var(--primary)] underline underline-offset-2"
              >
                상품 보기 →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
