import { PropertyTagProps } from "./types";
import clsx from "clsx";

const PropertyTag: React.FC<PropertyTagProps> = ({
  className,
  propertyType,
}) => {
  return (
    <p
      className={clsx(
        "rounded-lg py-1 px-4 font-normal text-sm max-w-fit text-center",
        {
          "bg-status-success-1 text-status-success-3":
            propertyType === "rental",
          "bg-brand-3 text-brand-9": propertyType === "facility",
        },
        className
      )}
    >
      {propertyType === "rental" ? "Rental Property" : "Facility Property"}
    </p>
  );
};

export default PropertyTag;
