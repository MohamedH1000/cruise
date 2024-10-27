"use client";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";

const MarkerIcon2x = "/assets/images/marker-icon-2x.png"; // ✅
const MarkerIcon = "/assets/images/marker-icon.png";
const MarkerShadow = "/assets/images/marker-shadow.png";
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  IconUrl: MarkerIcon,
  IconRetinaUrl: MarkerIcon2x,
  shadowUrl: MarkerShadow,
});
const Icon = L.icon({
  iconUrl: MarkerIcon, // Using the regular size marker icon
  iconRetinaUrl: MarkerIcon2x, // Retina icon (higher resolution for high DPI screens)
  shadowUrl: MarkerShadow, // Shadow image
  iconSize: [25, 41], // Set the size of the icon (width, height)
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from where the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Set the size of the shadow
});
const MapDisplay = ({ cruise }: any) => {
  const t = useTranslations();
  return (
    <>
      {cruise?.location?.lat ? (
        <div className="w-full mt-5 z-20">
          <MapContainer
            center={[cruise?.location?.lat, cruise?.location?.lng]} // Use the current position for centering the map
            zoom={14}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-[5px] z-[20]"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="z-[20]"
            />
            <Marker
              position={[cruise?.location?.lat, cruise?.location?.lng]}
              icon={Icon}
            />
          </MapContainer>
        </div>
      ) : (
        <div className="mt-20">
          <h1 className="font-bold text-xl">{t("translations.noLocation")}</h1>
        </div>
      )}
    </>
  );
};

export default MapDisplay;
