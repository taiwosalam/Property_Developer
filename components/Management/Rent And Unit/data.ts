export const getBackgroundColor = (StatusName: string): string => {
  switch (StatusName) {
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

export const activeStatuses = [
  "vacant",
  "occupied",
  "active",
  "expired",
  "relocate",
];

export const actions = [
  { color: "#FF9800", label: "Start Rent" },
  { color: "#4CAF50", label: "Renew Rent" },
  { color: "#60A5FA ", label: "Edit" },
  { color: "#E9212E", label: "Move Out" },
];
