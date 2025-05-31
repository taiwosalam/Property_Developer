import React from "react";

// Enum-like object for status values to ensure consistency
const STATUS_COLORS: Record<string, string> = {
  vacant: "#FFBB53",
  occupied: "#01BA4C",
  active: "#0033C4",
  expired: "#E9212E",
  relocate: "#620E13",
};

export const getBackgroundColor = (status: string): string => {
  return STATUS_COLORS[status] || "#000";
};

interface StatusDotsProps {
  status: string;
  propertyType?: string;
  partial_pending?: boolean;
}

export const StatusDots: React.FC<StatusDotsProps> = ({
  status,
  propertyType,
  partial_pending,
}) => {
  let colors: string[] = [];

  // Handle specific cases based on propertyType and status
  if (propertyType === "facility" && status === "occupied") {
    // Show only the "active" dot for occupied facilities
    colors = [getBackgroundColor("active")];
  } else if (propertyType === "facility" && status === "expired") {
    // Show "expired" and "active" dots for expired facilities
    colors = [getBackgroundColor("expired"), getBackgroundColor("active")];
  } else if (propertyType === "rental" && status === "expired") {
    // Show "occupied" and "expired" dots for expired rentals
    colors = [getBackgroundColor("occupied"), getBackgroundColor("expired")];
  } else if (status === "relocate") {
    // Show "vacant" and "relocate" dots for relocate status
    colors = [getBackgroundColor("vacant"), getBackgroundColor("relocate")];
  } else {
    // Default case: show a single dot for the given status
    colors = [getBackgroundColor(status)];
  }

    // Always show partial_pending yellow dot first if true
    if (partial_pending) {
      colors.unshift(getBackgroundColor("vacant")); // yellow
    }

  return (
    <div className="flex gap-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
          data-testid={`status-dot-${index}`}
        />
      ))}
    </div>
  );
};
