"use client";
import { PropertyProps } from "./types";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Form/Button/button";
import { variants, swipeConfidenceThreshold, wrap, swipePower } from "@/utils/slider";
import { motion, AnimatePresence } from "framer-motion";
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

interface PropertyCardProps extends PropertyProps {
  isClickable?: boolean;
  handleClickPreview?: (id: string | number) => void;
  handleClickManage?: (id: string | number) => void;
}


const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  propertyId,
  name,
  units,
  address,
  price,
  type,
  isClickable = true,
  handleClickPreview,
  handleClickManage,
}) => {
  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  const modalRef = useRef<HTMLDivElement>(null);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isModalActive, setIsModalActive] = useState(false);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, images.length, page);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalActive(false);
    }
  };

  useEffect(() => {
    if (isModalActive && isClickable) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isClickable, isModalActive]);

  return (
    <div
      className="rounded-xl max-w-[370px] mx-auto aspect-[0.961] relative"
      style={{ boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-t-xl">
        <button
          type="button"
          aria-label="previous"
          className={clsx(
            "w-6 h-6 rounded-full grid place-items-center absolute z-[2] left-2 top-1/2 transform -translate-y-1/2"
          )}
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={() => paginate(-1)}
        >
          <PreviousIcon />
        </button>
        <button
          type="button"
          aria-label="next"
          className={clsx(
            "w-6 h-6 rounded-full grid place-items-center absolute z-[2] right-2 top-1/2 transform -translate-y-1/2"
          )}
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={() => paginate(1)}
        >
          <NextIcon />
        </button>

        <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 bottom-2">
          <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+23</p>
          </div>
          <div className="bg-brand-1 rounded py-1 px-1.5 grid place-items-center">
            <VideoIcon />
          </div>
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={sampleImages[imageIndex].src}
            alt={`${name} ${imageIndex + 1}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          />
        </AnimatePresence>
        {isModalActive && isClickable && (
          <div
            className="absolute z-[3] inset-0 flex items-center justify-between px-[10%] gap-x-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            ref={modalRef}
          >
            <Button
              type="button"
              size="mid"
              className="!py-[8px] !px-8 !font-bold"
              onClick={() => handleClickManage?.(id)}
            >
              Manage
            </Button>
            <Button
              type="button"
              size="mid"
              className="py-[8px] !px-8 !font-bold"
              onClick={() => handleClickPreview?.(id)}
            >
              Preview
            </Button>
          </div>
        )}
      </div>
      <div
        className="relative cursor-pointer bg-white rounded-b-xl p-4"
        role="button"
        onClick={() => setIsModalActive(true)}
      >
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
            <p className="text-[#606060] font-normal text-xs">Annual Returns</p>
            <p className="text-text-disabled font-medium text-sm">
              <span className="text-highlight">₦700,000</span> / Annual Income
            </p>
          </div>
        </div>
      </div>
      {isModalActive && isClickable && (
        <div className="bg-white px-8 pt-4 pb-10 text-xs grid grid-cols-3 gap-x-4 gap-y-2 absolute bottom-0 w-full rounded-b-xl h-[55%] z-[3] cursor-default">
          <div>
            <p className="text-label font-normal">Branch</p>
            <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
          </div>
          <div>
            <p className="text-label font-normal">Total Unit</p>
            <p className="text-brand-9 font-bold">12</p>
          </div>
          <div>
            <p className="text-label font-normal">
              {type === "rent" ? "Available" : "Owing"} Units
            </p>
            <p className="text-brand-9 font-bold">5</p>
          </div>
          <div>
            <p className="text-label font-normal">Account Officer</p>
            <p className="text-brand-9 font-bold">Anikulapo Jesus</p>
          </div>
          <div>
            <p className="text-label font-normal">Mobile Tenants</p>
            <p className="text-brand-9 font-bold">12</p>
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
  );
};

export default PropertyCard;
