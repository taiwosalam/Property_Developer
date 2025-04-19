import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CameraIcon, ChevronLeft } from "@/public/icons/icons";
import { PropertyDetailsProps, PropertyImageSliderProps } from "./types";
import { actions, activeStatuses, getBackgroundColor } from "./data";
import { ActionButton } from "./action-button";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import PropertyTag from "@/components/Tags/property-tag";
import { useRouter } from "next/navigation";
import ImageSlider from "@/components/ImageSlider/image-slider";
import { RentalPropertyCardProps } from "@/app/(nav)/management/rent-unit/data";
import { StatusDots } from "./status-dot";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

export const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({
  images,
  showOverlay,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // console.log("images", images)

  return (
    <div ref={sliderRef} className="keen-slider relative h-full w-full">
      {images.map((image, index) => (
        <div key={index} className="keen-slider__slide h-full relative w-full">
          <Image
            src={image.path}
            alt={`Property image ${index + 1}`}
            fill
            sizes="auto"
            priority={index === 0}
            className="object-cover object-center"
          />
        </div>
      ))}
      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-45 transition-opacity" />
      )}
      {loaded && instanceRef.current && (
        <>
          <div className="absolute w-full flex items-center justify-between top-5 px-5">
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-[6px] flex items-center space-x-1">
              <CameraIcon width={16} height={16} />
              <span className="text-sm font-medium">
                {currentSlide + 1 + "/" + images.length}
              </span>
            </div>
          </div>
          <button
            aria-label="Previous image"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#EFF6FF] bg-opacity-50 rounded-full"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
          >
            <ChevronLeft fill="#FFFFFF" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#EFF6FF] bg-opacity-50 rounded-full rotate-180"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
          >
            <ChevronLeft fill="#FFFFFF" />
          </button>
        </>
      )}
    </div>
  );
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  rent,
  cautionDeposit,
  serviceCharge,
}) => {
  const CURRENCY = currencySymbols["naira"];
  return (
    <div className="flex items-center justify-between flex-wrap space-y-1">
      <div>
        <h6 className="text-xs font-normal text-text-label dark:text-darkText-1">
          Rent
        </h6>
        <p className="text-sm font-medium text-brand-primary">
          {CURRENCY}
          {formatNumber(rent)}
        </p>
      </div>
      <div>
        <h6 className="text-xs font-normal text-text-label dark:text-darkText-1">
          Caution Deposit
        </h6>
        <p className="text-sm font-medium text-brand-primary">
          {CURRENCY}
          {formatNumber(cautionDeposit)}
        </p>
      </div>
      <div>
        <h6 className="text-xs font-normal text-text-label dark:text-darkText-1">
          Service Charge
        </h6>
        <p className="text-sm font-medium text-brand-primary">
          {CURRENCY}
          {formatNumber(serviceCharge)}
        </p>
      </div>
    </div>
  );
};

const RentalPropertyCard: React.FC<RentalPropertyCardProps> = ({
  propertyType,
  images,
  unitId,
  unit_title,
  unit_name,
  unit_type,
  tenant_name,
  expiry_date,
  rent,
  caution_deposit,
  service_charge,
  status,
  tenant_id,
  badge_color,
  fee_period,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden shadow-lg">
      <div className="h-[200px] relative">
        <PropertyTag
          propertyType={propertyType}
          className="absolute top-5 right-5 z-10"
        />
        {/* <PropertyImageSlider images={images} showOverlay={isHovered} /> */}
        <ImageSlider images={images.map((image) => image)} className="h-full" />
      </div>
      <div
        role="button"
        className="p-2 pb-4 border-b border-[#C0C2C8] space-y-3 cursor-pointer transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/management/rent-unit/${unitId}`)}
      >
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white">
              {unit_title}
            </h3>
            <div className="flex items-center space-x-1">
              <StatusDots status={status} propertyType={propertyType} />
            </div>
          </div>
          <p className="text-sm font-normal">{unit_name + " " + unit_type}</p>

          {/* Hover information */}
          <div
            className={`absolute inset-0 bg-white dark:bg-darkText-primary py-2 transition-all duration-300 flex items-center justify-between ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Unit ID
              </span>
              <p className="text-brand-primary font-medium"> {unitId} </p>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Tenant‘s Name
              </span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-brand-primary border-b border-brand-primary">
                  {tenant_name}
                </span>
                {badge_color && <BadgeIcon color={badge_color} />}
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Expiry Date 
              </span>
              <p className="text-brand-primary font-medium"> {expiry_date} </p>
            </div>
          </div>
        </div>
        <PropertyDetails
          rent={Number(rent)}
          cautionDeposit={Number(caution_deposit)}
          serviceCharge={Number(service_charge)}
        />
      </div>
      {/* BUTTONS ACCORDING TO STATUS */}
      <div className="flex items-center justify-end my-5 gap-2 px-2 flex-wrap">
        {actions
          .filter((action) => {
            const label =
              typeof action.label === "function"
                ? action.label(propertyType)
                : action.label;

            // Define button visibility based on status
            if (status === "vacant" || status === "relocate") {
              return label === "Start Rent" || label === "Start Counting";
            }
            if (status === "occupied") {
              // Exclude "Renew Rent" and "Renew Fee" for occupied status
              return (
                label !== "Start Rent" &&
                label !== "Start Counting" &&
                label !== "Renew Rent" &&
                label !== "Renew Fee"
              );
            }
            if (status === "expired") {
              return (
                label === "Renew Rent" ||
                label === "Renew Fee" ||
                // label === "Edit" ||
                label === "Move Out" ||
                label === "Relocate"
              );
            }
            return false; // Default: hide all buttons if status is unknown
          })
          .filter((action) => {
            const label =
              typeof action.label === "function"
                ? action.label(propertyType)
                : action.label;

            // Additional filtering based on propertyType
            if (propertyType === "rental" && label === "Relocate") {
              return false;
            }
            if (propertyType === "facility" && label === "Move Out") {
              return false;
            }
            return true;
          })
          .map((action, i) => (
            <ActionButton
              unit_id={unitId}
              key={i}
              {...action}
              route={
                typeof action.route === "function"
                  ? action.route(unitId, propertyType)
                  : action.route
              }
              label={
                typeof action.label === "function"
                  ? action.label(propertyType)
                  : action.label
              }
            />
          ))}
      </div>
    </div>
  );
};

export default RentalPropertyCard;
