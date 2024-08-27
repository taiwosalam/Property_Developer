import React from "react";

// Types
import type { SVGProps } from "./types";

// Imports
import { svgs } from "./svgs";

const SVG: React.FC<SVGProps> = ({ type, color = "#000", className }) => {
  // Clone the selected SVG element and apply the color to it
  const selectedSVG = React.cloneElement(svgs[type], {
    stroke: color,
  });

  return <div className={className}>{selectedSVG}</div>;
};

export default SVG;
