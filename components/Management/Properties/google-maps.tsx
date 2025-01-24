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
}: {
    setLat: (lat: number) => void;
    setLng: (lng: number) => void;
}) => {
    const { setIsOpen } = useModal();
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
        }
    };

    const handleGetCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation = { lat: latitude, lng: longitude };
                    setSelectedLocation(newLocation);
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
        if (selectedLocation) {
            // console.log("selectedLocation:", selectedLocation);
            setLat(selectedLocation.lat);
            setLng(selectedLocation.lng);
        }
    }, [selectedLocation, setLat, setLng]);

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
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={selectedLocation}
                        zoom={10}
                        onClick={handleMapClick}
                    >
                        {/* Marker at the selected location */}
                        <Marker position={selectedLocation} draggable={true} />
                    </GoogleMap>
                    <div className="flex justify-end gap-4 my-4">
                        <Button
                            size="base_bold"
                            className="py-[10px] px-8"
                            type="button"
                            onClick={handleGetCurrentLocation}
                        >
                            Pick Current Location
                        </Button>
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
