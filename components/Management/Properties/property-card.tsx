"use client";
import { PropertyProps } from "./types";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Form/Button/button";
import {
  variants,
  swipeConfidenceThreshold,
  wrap,
  swipePower,
} from "@/utils/slider";
import { motion, AnimatePresence } from "framer-motion";
import ImageModal from "@/components/ImageModal/image-modal";
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
import { empty } from "@/app/config";

interface PropertyCardProps extends PropertyProps {
  isClickable?: boolean;
  handleClickPreview?: (id: string | number) => void;
  handleClickManage?: (id: string | number) => void;
}

const CURRENCY_SYMBOL = "₦";
const NUMBER_FORMAT_LOCALE = "en-NG";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(price);
};

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
  const [screenModal, setScreenModal] = useState(false);

  const paginate = (e: any, newDirection: number) => {
    e.preventDefault();
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
      className="rounded-2xl relative overflow-hidden bg-white"
      style={{ boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}

      <ImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={sampleImages.map((image) => image.src)}
        currentIndex={imageIndex}
      />

      <div className="relative h-[200px] w-full overflow-hidden rounded-t-2xl group">
        <button
          type="button"
          aria-label="previous"
          className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] left-2 top-1/2 transform -translate-y-1/2"
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={(e) => paginate(e, -1)}
        >
          <PreviousIcon />
        </button>
        <button
          type="button"
          aria-label="next"
          className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] right-2 top-1/2 transform -translate-y-1/2"
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={(e) => paginate(e, 1)}
        >
          <NextIcon />
        </button>

        {/* Top left corner */}
        <div className="absolute z-[2] top-2 left-2 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CameraIcon width={16} height={16} />
          <span className="text-sm font-medium">
            {`${imageIndex + 1}/${images.length}`}
          </span>
        </div>

        {/* Bottom right corner */}
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
            onClick={() => setScreenModal(true)}
            key={page}
            src={sampleImages[imageIndex]?.src || empty}
            alt={`${name} ${imageIndex + 1}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              e.preventDefault();
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(e, 1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(e, -1);
              }
            }}
            className="absolute inset-0 cursor-pointer"
          />
        </AnimatePresence>
        <AnimatePresence>
          {isModalActive && isClickable && (
            <motion.div
              key="modal-buttons"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ stiffness: 100, duration: 0.3 }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className="relative cursor- rounded-b-2xl p-4"
        role="button"
        onClick={isClickable ? () => setIsModalActive(true) : undefined}
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
            <p className="text-brand-primary text-xl font-bold">{`${CURRENCY_SYMBOL}${formatPrice(
              price
            )}`}</p>
            <p className="text-[#606060] font-normal text-xs">Annual Returns</p>
            <p className="text-text-disabled font-medium text-sm">
              <span className="text-highlight">{`${CURRENCY_SYMBOL}${formatPrice(
                700000
              )}`}</span>{" "}
              / Annual Income
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalActive && isClickable && (
          <motion.div
            key="Extra Info"
            transition={{ stiffness: 100, duration: 0.3 }}
            initial={{ y: "100%" }}
            animate={{ y: "0" }}
            exit={{ y: "100%" }}
            className="bg-white px-8 pt-4 pb-10 text-xs grid grid-cols-3 gap-x-4 gap-y-2 absolute bottom-0 w-full rounded-b-2xl z-[3] cursor-default h-[55%]"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyCard;
