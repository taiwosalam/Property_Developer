// import { useEffect, useState } from "react";

// // Hook to load the Google Maps API dynamically
// export const useGoogleMaps = (apiKey: string) => {
//   const [googleLoaded, setGoogleLoaded] = useState(false);

//   useEffect(() => {
//     const loadGoogleMapsAPI = () => {
//       if (typeof window !== "undefined" && !window.google) {
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//         script.async = true;
//         script.onload = () => setGoogleLoaded(true);
//         script.onerror = () => setGoogleLoaded(false);
//         document.head.appendChild(script);
//       }
//     };

//     loadGoogleMapsAPI();
//   }, [apiKey]);

//   return googleLoaded;
// };
