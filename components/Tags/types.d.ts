export interface UserTagProps {
  type: "web" | "mobile";
  className?: string;
}

export interface PropertyTagProps {
  propertyType: "rental" | "facility";
  className?: string;
  sm?: boolean;
}
