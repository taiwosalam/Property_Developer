"use client";

import React, { useEffect, useRef, useState } from "react";

// Types
import type { AutoResizingGridProps } from "./types";

// Imports
import { debounce } from "@/utils/debounce";
import clsx from "clsx";

/**
 * AutoResizingGrid component that adjusts its grid layout based on the container's width.
 *
 * @param {number} [minWidth=250] - The minimum width for each grid item.
 * @param {number} [gap=20] - The gap between the grid items.
 * @param {React.ReactNode} children - The child elements to be displayed in the grid.
 * @returns JSX.Element - The dynamically resizing grid container.
 */
const AutoResizingGrid: React.FC<AutoResizingGridProps> = ({
  minWidth = 250,
  gap = 20,
  children,
  containerClassName,
}) => {
  const [columns, setColumns] = useState(1); // State to track the number of columns
  const gridRef = useRef<HTMLDivElement>(null); // Ref for the grid container
  const [hasCalculated, setHasCalculated] = useState(false); // State to track if columns have been calculated

  useEffect(() => {
    const observer = gridRef.current;

    // Function to calculate and set the number of columns based on container width
    const handleResize = ([entry]: ResizeObserverEntry[]) => {
      const newColumns = Math.max(
        Math.floor((entry.contentRect.width + gap) / (minWidth + gap)),
        1
      ); // Ensure at least 1 column

      setHasCalculated(true); // Set state to true after calculating columns
      setColumns((prev) => (prev !== newColumns ? newColumns : prev));
    };

    // Debounced version of handleResize to minimize frequent state updates
    const debouncedResize = debounce(handleResize, 300);

    const resizeObserver = new ResizeObserver(debouncedResize); // Observe grid container size changes
    if (observer) {
      resizeObserver.observe(observer);
    }

    // Cleanup observer
    return () => {
      if (observer) {
        resizeObserver.unobserve(observer);
      }
    };
  }, [gap, minWidth]); // Effect re-runs if minWidth changes

  return (
    // The grid container with dynamic column count and custom gap
    <div
      ref={gridRef}
      className={clsx(
        "grid duration-300",
        {
          "opacity-0": !hasCalculated, // Hide grid while columns are being calculated
        },
        containerClassName
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`, // Allow users to pass custom gap
      }}
    >
      {columns > 0 ? children : null} {/* Render children if columns exist */}
    </div>
  );
};

export default AutoResizingGrid;
