// Types
import { property_listing_status } from "./data";
import type {
  PropertyListingRedProps,
  PropertyListingLabelIDProps,
  PropertyListingTitleDescProps,
  PropertyListingStatusItemProps,
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
          "bg-status-success-1 text-status-success-3": type === "rental",
          "bg-brand-3 text-brand-primary": type === "gated",
        }
      )}
    >
      {type} property
    </p>
    <p className="text-brand-10 text-base font-bold">ID: {id}</p>
  </div>
);

export const PropertyListingTitleDesc: React.FC<
  PropertyListingTitleDescProps
> = ({ desc, title }) => (
  <div className="custom-flex-col text-text-primary dark:text-darkText-1 text-base">
    <p className="font-bold">{title}</p>
    <p>{desc}</p>
  </div>
);

export const PropertyListingRed: React.FC<PropertyListingRedProps> = ({
  children,
}) => <p className="text-status-error-2 text-sm font-normal">{children}</p>;

export const PropertyListingParagraph: React.FC<PropertyListingRedProps> = ({
  children,
}) => <p className="text-text-secondary dark:text-darkText-1 text-base font-medium">{children}</p>;

export const PropertyListingStatusItem: React.FC<
  PropertyListingStatusItemProps
> = ({ text, color }) => {
  return (
    <div className="flex gap-2 items-center">
      <div
        className="w-[14px] h-[14px] sm:w-5 sm:h-5 rounded-full"
        style={{ backgroundColor: color }}
      ></div>
      <p className="text-[#6C6D6D] text-xs font-medium capitalize">{text}</p>
    </div>
  );
};
