"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

interface MapProps {
  setCruiseDetails?: any;
  cruiseDetails?: any;
}
function MyComponent({ cruiseDetails, setCruiseDetails }: any) {
  const map = useMapEvent("click", (e) => {
    // console.log(e.latlng);
    setCruiseDetails({
      ...cruiseDetails,
      location: {
        ...cruiseDetails?.location,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      },
    });
    map.setView(e.latlng, map.getZoom());
  });
  return null;
}

const Map: React.FC<MapProps> = ({
  setCruiseDetails,
  cruiseDetails,
  fullHeight,
}) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  useEffect(() => {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords;
    //       setCurrentPosition([latitude, longitude]);
    //     },
    //     (error) => {
    //       console.error("Error getting location:", error);
    //       // Fallback to default position if geolocation fails
    //       setCurrentPosition([25.276987, 55.296249]); // Cairo, Egypt (as fallback)
    //     }
    //   );
    // } else {
    //   // If geolocation is not supported, set a default location
    //   setCurrentPosition([25.276987, 55.296249]); // Cairo, Egypt (as fallback)
    // }
    setCurrentPosition([25.276987, 55.296249]); // Cairo, Egypt (as fallback)
  }, []);
  return (
    <div className="w-full">
      {currentPosition && (
        <MapContainer
          center={currentPosition} // Use the current position for centering the map
          zoom={12}
          scrollWheelZoom={false}
          className={`${fullHeight ? "h-[85vh]" : "h-[35vh]"} rounded-[5px]`}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cruiseDetails.location.lat && (
            <Marker
              position={[
                cruiseDetails.location.lat,
                cruiseDetails.location.lng,
              ]}
              icon={Icon}
            />
          )}
          <MyComponent
            setCruiseDetails={setCruiseDetails}
            cruiseDetails={cruiseDetails}
          />
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
