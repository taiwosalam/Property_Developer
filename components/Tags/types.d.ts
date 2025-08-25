export interface UserTagProps {
  type: "web" | "mobile";
  className?: string;
}

export interface PropertyTagProps {
  propertyType: "rental" | "facility" | "outright" | "installment";
  className?: string;
  sm?: boolean;
  list?: boolean;
}
