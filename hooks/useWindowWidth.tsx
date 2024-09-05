"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to get the current window width and determine device breakpoints.
 *
 * @param {number} [customWidth] - Optional custom width to determine the `isCustom` breakpoint.
 * @returns {object} - The current window width and a set of boolean values for different device breakpoints.
 */
const useWindowWidth = (customWidth?: number) => {
  /**
   * State to store the current window width. Initially set to `undefined`
   * to avoid SSR issues with `window` not being defined.
   * @type {number | undefined}
   */
  const [windowWidth, setWindowWidth] = useState<number | undefined>(
    typeof window !== "undefined" ? window.innerWidth : undefined
  );

  /**
   * Effect to update the window width on resize. This runs only on the client side.
   */
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure this only runs on the client side

    // Function to update the window width state when the window is resized
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Set the initial window width when the component mounts
    setWindowWidth(window.innerWidth);

    // Add event listener to handle window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Breakpoints for various device sizes
  // Breakpoints for various device sizes
  const breakpoints = {
    /** Checks if the window width is less than 768px (Mobile). */
    isMobile: windowWidth !== undefined && windowWidth < 768,

    /** Checks if the window width is between 768px and 1023px (Tablet). */
    isTablet:
      windowWidth !== undefined && windowWidth >= 768 && windowWidth < 1024,

    /** Checks if the window width is between 1024px and 1439px (Laptop). */
    isLaptop:
      windowWidth !== undefined && windowWidth >= 1024 && windowWidth < 1440,

    /** Checks if the window width is 1440px or greater (Desktop). */
    isDesktop: windowWidth !== undefined && windowWidth >= 1440,

    /** Checks if the window width is smaller than the customWidth, if a custom width is provided. */
    isCustom: customWidth
      ? windowWidth !== undefined && windowWidth < customWidth
      : false,

    /** Checks if the window width is less than or equal to 768px (Small Tablet). */
    isSmallTablet: windowWidth !== undefined && windowWidth < 768,

    /** Checks if the window width is less than or equal to 1024px (Small Laptop). */
    isSmallLaptop: windowWidth !== undefined && windowWidth < 1024,
  };

  /**
   * Return the current window width and the breakpoints.
   * @returns {object} The window width and breakpoint checks (isMobile, isTablet, etc.)
   */
  return { windowWidth, ...breakpoints };
};

export default useWindowWidth;
