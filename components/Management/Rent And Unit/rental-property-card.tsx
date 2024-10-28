import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Sample from "@/public/empty/SampleProperty.jpeg";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import { CameraIcon, ChevronLeft } from "@/public/icons/icons";
import { PropertyDetailsProps, PropertyImageSliderProps } from "./types";
import { actions, activeStatuses, getBackgroundColor } from "./data";
import { ActionButton } from "./action-button";

const CURRENCY = "₦";
const NUMBER_FORMAT_LOCALE = "en-NG";

const useNumberFormat = () => {
  return (number: number) =>
    new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(number);
};

export const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({
  images,
  showOverlay,
  thread,
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

  return (
    <div ref={sliderRef} className="keen-slider relative h-full w-full">
      {images.map((image, index) => (
        <div key={index} className="keen-slider__slide h-full relative w-full">
          <Image
            src={image}
            alt={`Property image ${index + 1}`}
            fill
            sizes="auto"
            priority={index === 0}
            className="object-cover object-center"
          />
        </div>
      ))}
      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-45 transition-opacity"></div>
      )}
      {loaded && instanceRef.current && (
        <>
          <div className="absolute w-full flex items-center justify-between top-5 px-5">
            {!thread && (
              <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-[6px] flex items-center space-x-1">
                <CameraIcon width={16} height={16} />
                <span className="text-sm font-medium">
                  {currentSlide + 1 + "/" + images.length}
                </span>
              </div>
            )}
            <div className="bg-status-success-1 rounded-lg py-1 px-4 text-sm font-medium text-status-success-3">
              {!thread && <p>Gated Property</p>}
            </div>
          </div>
          <button
            aria-label="Previous image"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#EFF6FF] bg-opacity-50 rounded-full p-2"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
          >
            <ChevronLeft fill="#FFFFFF" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#EFF6FF] bg-opacity-50 rounded-full p-2 rotate-180"
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
  const formatNumber = useNumberFormat();
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

const RentalPropertyCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const sampleImages: StaticImageData[] = [
    Sample,
    Sample2,
    Sample3,
    Sample4,
    Sample5,
  ];

  return (
    <div className="bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden shadow-lg">
      <div className="h-[200px] relative">
        <PropertyImageSlider images={sampleImages} showOverlay={isHovered} />
      </div>
      <div
        className="p-2 pb-4 border-b border-[#C0C2C8] space-y-3 cursor-pointer transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() =>
          window.location.assign("/management/rent-unit/1234567867")
        }
      >
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white">
              Moniya Apartment
            </h3>
            <div className="flex items-center space-x-1">
              {activeStatuses.map((status) => (
                <div
                  key={status}
                  className="w-[15px] h-[15px] rounded-full"
                  style={{ backgroundColor: getBackgroundColor(status) }}
                ></div>
              ))}
            </div>
          </div>
          <p className="text-sm font-normal">
            Newly Built 5 Bedroom Detached Duplex
          </p>

          {/* Hover information */}
          <div
            className={`absolute inset-0 bg-white dark:bg-darkText-primary py-2 transition-all duration-300 flex items-center justify-between ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Unit ID
              </span>
              <p className="text-brand-primary font-medium">1234567867</p>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Tenant&lsquo;s Name
              </span>
              <p className="text-brand-primary font-medium">
                Ajaia David <span className="text-green-500">●</span>
              </p>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-text-label dark:text-darkText-1 text-xs">
                Expiry Date
              </span>
              <p className="text-brand-primary font-medium">25/02/2024</p>
            </div>
          </div>
        </div>
        <PropertyDetails
          rent={3000000}
          cautionDeposit={3000000}
          serviceCharge={3000000}
        />
      </div>
      <div className="flex items-center justify-end my-5 gap-2 px-2 flex-wrap">
        {actions.map((action) => (
          <ActionButton key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
};

export default RentalPropertyCard;
