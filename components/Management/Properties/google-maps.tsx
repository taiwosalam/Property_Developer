import React, { useEffect, useState } from "react";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Button from "@/components/Form/Button/button";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/modal";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.5244, // Default Latitude (e.g., Lagos)
  lng: 3.3792, // Default Longitude (e.g., Lagos)
};

const GoogleMapsModal = ({
  setLat,
  setLng,
  setCoordinate,
  coordinate,
}: {
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  setCoordinate: (coordinate: string) => void;
  coordinate: string | number;
}) => {
  const { setIsOpen } = useModal();
  const [locationPicked, setLocationPicked] = useState(false);
  const [selectedLoacationPoint, setSelectedLoacationPoint] = useState<null | {
    lat: number;
    lng: number;
  }>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedLocation, setSelectedLocation] = useState(center);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(newLocation);
      setSelectedLoacationPoint(newLocation);
      // console.log("new location", newLocation)
      setCoordinate(`${event.latLng.lat()}, ${event.latLng.lng()}`);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setSelectedLocation(newLocation);
          setCoordinate(`${latitude}, ${longitude}`);
          setLocationPicked(true); // HIDE THE BUTTON
          toast.success("Your current Location has been added successfully.");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to fetch your current location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (coordinate) {
      // console.log("selectedLocation:", selectedLocation);
      setLat(selectedLocation.lat as number);
      setLng(selectedLocation.lng as number);
    }
  }, [coordinate, setLat, setLng]);

  if (loadError) {
    return (
      <LandlordTenantModalPreset heading="Choose Location">
        <p>Error loading map: {loadError.message}</p>
      </LandlordTenantModalPreset>
    );
  }

  return (
    <LandlordTenantModalPreset heading="Choose Location">
      {!isLoaded ? (
        <p>Loading map...</p>
      ) : (
        <>
          <p className="text-[#747474] mb-5">
            Zoom in to the property area, then drag and click the map pointer to
            mark the exact location. Alternatively, if you&apos;re on-site,
            select your current location and click &apos;Save Location.&apos;
            Make sure your device&apos;s location services are enabled and
            accurate before choosing the current location.
          </p>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedLocation}
            // center={coordinate}
            zoom={10}
            onClick={handleMapClick}
          >
            {/* Marker at the selected location */}
            <Marker position={selectedLocation} draggable={true} />
          </GoogleMap>
          <div className="flex justify-end items-center gap-4 mb-4 mt-10">
            {/* {!locationPicked && (
              <Button
                size="base_bold"
                className="py-[10px] px-8"
                type="button"
                variant="sky_blue"
                onClick={handleGetCurrentLocation}
              >
                Pick Current Location
              </Button>
            )} */}
            {selectedLoacationPoint ? (
              <div className="flex items-center gap-2  flex-col text-center font-semibold text-brand-9">
                <p>Lat - {selectedLoacationPoint.lat.toFixed(5)}</p>
                <p>Long - {selectedLoacationPoint.lng.toFixed(5)}</p>
              </div>
            ) : (
              <Button
                size="base_bold"
                className="py-[10px] px-8"
                type="button"
                variant="sky_blue"
                onClick={handleGetCurrentLocation}
              >
                Pick Current Location
              </Button>
            )}
            <Button
              size="base_bold"
              className="py-[10px] px-8"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Save Location
            </Button>
          </div>
        </>
      )}
    </LandlordTenantModalPreset>
  );
};

export default GoogleMapsModal;
