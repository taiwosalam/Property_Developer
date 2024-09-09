"use client";
import Image from "next/image";
import { PropertyProps } from "./types";
import clsx from "clsx";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { motion, useAnimation } from "framer-motion";
import Sample from "@/public/empty/SampleProperty.jpeg";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";

import {
  LocationIcon,
  NextIcon,
  PreviousIcon,
  VideoIcon,
  CameraIcon,
} from "@/public/icons/icons";

const PropertyCard: React.FC<PropertyProps> = ({
  images,
  propertyId,
  name,
  units,
  address,
  price,
  type,
}) => {
  const controls = useAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalActive, setIsModalActive] = useState(false);
  const handleNextClick = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100 && currentImageIndex > 0) {
      handlePreviousClick();
    } else if (info.offset.x < -100 && currentImageIndex < images.length - 1) {
      handleNextClick();
    }
  };

  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  return (
    <div className="rounded-xl min-w-[370px]">
      <div className="relative h-[200px] w-full overflow-hidden rounded-t-xl">
        <button
          type="button"
          aria-label="previous"
          className={clsx(
            "w-6 h-6 rounded-full grid place-items-center absolute z-[1] left-2 top-1/2 transform -translate-y-1/2",
            currentImageIndex === 0 && "opacity-80"
          )}
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={handlePreviousClick}
          disabled={currentImageIndex === 0}
        >
          <PreviousIcon />
        </button>
        <button
          type="button"
          aria-label="next"
          className={clsx(
            "w-6 h-6 rounded-full grid place-items-center absolute z-[1] right-2 top-1/2 transform -translate-y-1/2",
            currentImageIndex === images.length - 1 && "opacity-80"
          )}
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={handleNextClick}
          disabled={currentImageIndex === images.length - 1}
        >
          <NextIcon />
        </button>
        <div className="flex items-stretch gap-[10px] absolute z-[1] right-2 bottom-2">
          <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+23</p>
          </div>
          <div className="bg-brand-1 rounded py-1 px-1.5 grid place-items-center">
            <VideoIcon />
          </div>
        </div>

        <motion.div
          key={currentImageIndex}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0"
        >
          <Image
            src={sampleImages[currentImageIndex]}
            alt={`${name} ${currentImageIndex + 1}`}
            fill
            objectFit="cover"
            className="object-cover"
          />
          {isModalActive && (
            <div
              className="absolute z-[10] inset-0 flex items-center justify-between px-10"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            >
              <Button
                type="button"
                size="mid"
                className="!py-[8px] !px-8 !font-bold"
              >
                Manage
              </Button>
              <Button
                type="button"
                size="mid"
                className="py-[8px] !px-8 !font-bold"
              >
                Preview
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <div
        className="p-4 bg-white rounded-b-xl cursor-pointer"
        role="button"
        onClick={() => setIsModalActive((x) => !x)}
      >
        {!isModalActive ? (
          <div>
            <p className="text-brand-5 text-sm font-bold">ID: {propertyId}</p>
            <p className="text-[#374151] text-2xl font-bold">
              {name} <br />({units} Units)
            </p>
            <p className="flex items-center gap-1 text-brand-tertiary text-sm font-normal">
              <LocationIcon /> {address}
            </p>
            <div className="flex justify-between items-end mt-1">
              <p
                className={clsx(
                  "px-4 py-1 text-[10px] font-normal rounded-lg",
                  type === "rent"
                    ? "text-success-3 bg-success-1"
                    : "text-brand-9 bg-brand-3"
                )}
              >
                {type === "rent" ? "Rental Property" : "Gated Estate"}
              </p>
              <div className="text-right">
                <p className="text-brand-primary text-xl font-bold">{price}</p>
                <p className="text-[#606060] font-normal text-xs">
                  Annual Returns
                </p>
                <p className="text-text-disabled font-medium text-sm">
                  <span className="text-highlight">₦700,000</span> / Annual
                  Income
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs grid grid-cols-3 gap-x-4 gap-y-2">
            <div>
              <p className="text-label font-normal">Branch</p>
              <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
            </div>
            <div>
              <p className="text-label font-normal">Total Unit</p>
              <p className="text-brand-9 font-bold">12</p>
            </div>
            <div>
              <p className="text-label font-normal">Available Units</p>
              <p className="text-brand-9 font-bold">5</p>
            </div>
            <div>
              <p className="text-label font-normal">Account Officer</p>
              <p className="text-brand-9 font-bold">Anikulapo Jesus</p>
            </div>
            <div>
              <p className="text-label font-normal">Mobile Tenants</p>
              <p>12</p>
            </div>
            <div>
              <p className="text-label font-normal">Web Tenants</p>
              <p className="text-brand-9 font-bold">5</p>
            </div>
            <div>
              <p className="text-label font-normal">Last Updated</p>
              <p className="text-brand-9 font-bold">5 hours ago</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
