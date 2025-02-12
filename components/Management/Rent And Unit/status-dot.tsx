import React from "react";

export const getBackgroundColor = (status: string): string => {
  switch (status) {
    case "vacant":
      return "#FFBB53";
    case "occupied":
      return "#01BA4C";
    case "active":
      return "#0033C4";
    case "expired":
      return "#E9212E";
    case "relocate":
      return "#620E13";
    default:
      return "#000";
  }
};

interface StatusDotsProps {
  status: string;
  propertyType?: string;
}

export const StatusDots: React.FC<StatusDotsProps> = ({ status, propertyType }) => {
  let colors: string[] = [];

  // If propertyType is 'facility' and status is 'occupied', show only the active color.
  if (propertyType === "facility" && status === "occupied") {
    colors = [getBackgroundColor("active")];
  } else if (status === "relocate") {
    // Show two dots: one for "vacant" and one for "relocate"
    colors = [getBackgroundColor("vacant"), getBackgroundColor("relocate")];
  } else if (status === "expired") {
    // Show three dots: one for "occupied", one for "expired", one for "active"
    colors = [
      getBackgroundColor("occupied"),
      getBackgroundColor("expired"),
      getBackgroundColor("active"),
    ];
  } else {
    // Otherwise, show a single dot with the corresponding status color
    colors = [getBackgroundColor(status)];
  }

  return (
    <div className="flex gap-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};