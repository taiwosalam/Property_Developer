"use client";

import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "large">("large");

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize("mobile");
      } else if (width <= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    updateScreenSize(); // Set initial screen size
    window.addEventListener("resize", updateScreenSize); // Update on resize
    return () => window.removeEventListener("resize", updateScreenSize); // Cleanup
  }, []);

  return screenSize;
};

export default useScreenSize;
