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
    coordinate
}: {
    setLat: (lat: number) => void;
    setLng: (lng: number) => void;
    setCoordinate: (coordinate: string) => void;
    coordinate: string | number;
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
                <p className="text-[#747474] mb-5">Zoom in to the property area, then drag and click the map pointer to mark the exact location. Alternatively, if you&apos;re on-site, select your current location and click &apos;Save Location.&apos; Make sure your device&apos;s location services are enabled and accurate before choosing the current location.</p>
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


// LATEST GOOGLE MAP AS AT 2025 BUT NO MARKER SHOW 
// import React, { useState, useEffect, useRef } from "react";
// import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
// import Button from "@/components/Form/Button/button";
// import { toast } from "sonner";
// import { useModal } from "@/components/Modal/modal";
// import { Loader } from "@googlemaps/js-api-loader";

// const containerStyle = {
//     width: "100%",
//     height: "400px",
// };

// const center = {
//     lat: 6.5244, // Default Latitude (e.g., Lagos)
//     lng: 3.3792, // Default Longitude (e.g., Lagos)
// };

// const GoogleMapsModal = ({
//     setLat,
//     setLng,
// }: {
//     setLat: (lat: number) => void;
//     setLng: (lng: number) => void;
// }) => {
//     const { setIsOpen } = useModal();
//     const [selectedLocation, setSelectedLocation] = useState(center);
//     const mapRef = useRef<google.maps.Map | null>(null);
//     const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);

//     const handleMapClick = (event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             const newLocation = {
//                 lat: event.latLng.lat(),
//                 lng: event.latLng.lng(),
//             };
//             setSelectedLocation(newLocation);

//             if (markerRef.current) {
//                 markerRef.current.position = newLocation;
//             }
//         }
//     };

//     const handleGetCurrentLocation = () => {
//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     const newLocation = { lat: latitude, lng: longitude };
//                     setSelectedLocation(newLocation);

//                     if (markerRef.current) {
//                         markerRef.current.position = newLocation;
//                     }
//                     toast.success("Your current location has been added successfully.");
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                     toast.error("Unable to fetch your current location.");
//                 }
//             );
//         } else {
//             toast.error("Geolocation is not supported by your browser.");
//         }
//     };

//     useEffect(() => {
//         if (selectedLocation) {
//             setLat(selectedLocation.lat);
//             setLng(selectedLocation.lng);
//         }
//     }, [selectedLocation, setLat, setLng]);

//     useEffect(() => {
//         const loader = new Loader({
//             apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//             version: "weekly",
//         });

//         loader.load().then(() => {
//             if (mapContainerRef.current) {
//                 const map = new google.maps.Map(mapContainerRef.current, {
//                     center: selectedLocation,
//                     zoom: 10,
//                 });
//                 mapRef.current = map;

//                 const marker = new google.maps.marker.AdvancedMarkerElement({
//                     map,
//                     position: selectedLocation,
//                     title: "Selected Location",
//                     gmpDraggable: true, // Correct property to make the marker draggable
//                 });
//                 markerRef.current = marker;

//                 // Update marker position when dragged
//                 marker.addListener("position_changed", () => {
//                     const position = marker.position;
//                     if (position) {
//                         // Check if lat and lng are functions or numbers
//                         const newLocation = {
//                             lat: typeof position.lat === "function" ? position.lat() : position.lat,
//                             lng: typeof position.lng === "function" ? position.lng() : position.lng,
//                         };
//                         setSelectedLocation(newLocation);
//                         console.log("new location", newLocation)
//                     }
//                 });


//                 // Update marker position on map click
//                 map.addListener("click", handleMapClick);
//             }
//         });
//     }, []);

//     return (
//         <LandlordTenantModalPreset heading="Choose Location">
//             <div ref={mapContainerRef} style={containerStyle}></div>
//             <div className="flex justify-end gap-4 my-4">
//                 <Button
//                     size="base_bold"
//                     className="py-[10px] px-8"
//                     type="button"
//                     onClick={handleGetCurrentLocation}
//                 >
//                     Pick Current Location
//                 </Button>
//                 <Button
//                     size="base_bold"
//                     className="py-[10px] px-8"
//                     type="button"
//                     onClick={() => setIsOpen(false)}
//                 >
//                     Save Location
//                 </Button>
//             </div>
//         </LandlordTenantModalPreset>
//     );
// };

// export default GoogleMapsModal;