import React from "react";

// Types
import type { LabelProps } from "./types";

const Label: React.FC<LabelProps> = ({ id, children }) => {
  return (
    <label htmlFor={id} className="text-text-label text-base font-medium capitalize">
      {children}
    </label>
  );
};

export default Label;
