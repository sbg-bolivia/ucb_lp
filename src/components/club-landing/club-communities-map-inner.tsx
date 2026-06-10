"use client";

import { AWS_COMMUNITY_TYPE_LABELS } from "@/lib/aws-labels";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { AwsCommunityPublic } from "./club-communities-types";

const BOLIVIA_CENTER: [number, number] = [-16.5, -64.5];

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

type Props = {
  communities: AwsCommunityPublic[];
};

export default function ClubCommunitiesMapInner({ communities }: Props) {
  const withCoords = communities.filter(
    (c) => c.latitude != null && c.longitude != null
  );

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
        {withCoords.map((c) => (
          <Marker
            key={c.id}
            position={[c.latitude as number, c.longitude as number]}
            icon={c.isOwnGroup ? ownGroupIcon : defaultIcon}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[260px] text-sm">
                <p className="font-bold text-[#1d1d1f]">{c.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                  {c.department ? ` · ${c.department}` : ""}
                </p>
                {c.description ? (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {c.description}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.websiteUrl ? (
                    <a
                      href={c.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#3b41ff] hover:underline"
                    >
                      Sitio web
                    </a>
                  ) : null}
                  {c.meetupUrl ? (
                    <a
                      href={c.meetupUrl}
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
        ))}
      </MapContainer>
    </div>
  );
}
