"use client";

import { AWS_COMMUNITY_TYPE_LABELS } from "@/lib/aws-labels";
import { safeExternalHref } from "@/lib/event-registration-url";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";

import type { AwsCommunityPublic } from "./club-communities-types";

const BOLIVIA_CENTER: [number, number] = [-16.5, -64.5];
const FOCUS_ZOOM = 11;

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ownGroupIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#00C8FF,#7E2CFF);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#00C8FF,#7E2CFF);border:3px solid white;box-shadow:0 0 0 3px rgba(59,65,255,.45),0 4px 12px rgba(0,0,0,.35)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

type Props = {
  communities: AwsCommunityPublic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function MapFlyTo({
  position,
  zoom,
}: {
  position: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, zoom, { duration: 1.1 });
  }, [map, position, zoom]);

  return null;
}

function CommunityMarker({
  community,
  isSelected,
  onSelect,
}: {
  community: AwsCommunityPublic;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const website = safeExternalHref(community.websiteUrl);
  const meetup = safeExternalHref(community.meetupUrl);

  useEffect(() => {
    if (!isSelected || !markerRef.current) return;
    const timer = window.setTimeout(() => markerRef.current?.openPopup(), 450);
    return () => window.clearTimeout(timer);
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[community.latitude as number, community.longitude as number]}
      icon={
        isSelected
          ? selectedIcon
          : community.isOwnGroup
            ? ownGroupIcon
            : defaultIcon
      }
      eventHandlers={{
        click: () => onSelect(community.id),
      }}
    >
      <Popup>
        <div className="min-w-[200px] max-w-[260px] text-sm">
          <p className="font-bold text-[#1d1d1f]">{community.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {AWS_COMMUNITY_TYPE_LABELS[community.communityType]}
            {community.department ? ` · ${community.department}` : ""}
          </p>
          {community.description ? (
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {community.description}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#3b41ff] hover:underline"
              >
                Sitio web
              </a>
            ) : null}
            {meetup ? (
              <a
                href={meetup}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#F05663] hover:underline"
              >
                Meetup
              </a>
            ) : null}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function ClubCommunitiesMapInner({
  communities,
  selectedId,
  onSelect,
}: Props) {
  const withCoords = useMemo(
    () =>
      communities.filter((c) => c.latitude != null && c.longitude != null),
    [communities]
  );

  const selected = useMemo(
    () => withCoords.find((c) => c.id === selectedId) ?? null,
    [withCoords, selectedId]
  );

  const flyTarget = selected
    ? ([selected.latitude as number, selected.longitude as number] as [
        number,
        number,
      ])
    : null;

  return (
    <div className="relative z-0 h-[min(420px,55vh)] w-full overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10">
      <MapContainer
        center={BOLIVIA_CENTER}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full rounded-[2rem]"
        style={{ background: "#e8eef5" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {flyTarget ? (
          <MapFlyTo position={flyTarget} zoom={FOCUS_ZOOM} />
        ) : null}
        {withCoords.map((c) => (
          <CommunityMarker
            key={c.id}
            community={c}
            isSelected={c.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
}
