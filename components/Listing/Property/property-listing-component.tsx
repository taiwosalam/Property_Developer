// Types
import type {
  PropertyListingRedProps,
  PropertyListingLabelIDProps,
  PropertyListingTitleDescProps,
} from "./types";

// Imports
import clsx from "clsx";

export const PropertyListingLabelID: React.FC<PropertyListingLabelIDProps> = ({
  id,
  type,
}) => (
  <div className="flex gap-2">
    <p
      className={clsx(
        "rounded-full py-1 px-4 text-[10px] font-normal capitalize",
        {
          "bg-success-1 text-success-3": type === "rental property",
          "bg-brand-3 text-brand-primary": type === "gated property",
        }
      )}
    >
      {type}
    </p>
    <p className="text-brand-10 text-base font-bold">ID: {id}</p>
  </div>
);

export const PropertyListingTitleDesc: React.FC<
  PropertyListingTitleDescProps
> = ({ desc, title }) => (
  <div className="custom-flex-col text-text-primary text-base">
    <p className="font-bold">{title}</p>
    <p>{desc}</p>
  </div>
);

export const PropertyListingRed: React.FC<PropertyListingRedProps> = ({
  children,
}) => <p className="text-status-error-2 text-sm font-normal">{children}</p>;
