import { useEffect, useState } from "react";

export const useGoogleFonts = () => {
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);

  const fetchGoogleFonts = async () => {
      const apikey = process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY || "AIzaSyAbk2ZtRpeEZgqhQ8kwMQqrJNsIBJfzHa8";
      console.log("apikey = ", apikey);
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${apikey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error("Invalid response format");
        }
        setGoogleFonts(data.items.map((font: { family: string }) => font.family));
      } catch (error) {
        console.error("Error fetching Google Fonts:", error);
      }
    };
  
    useEffect(() => {
      fetchGoogleFonts();
    }, []);
  
    return googleFonts;
  };