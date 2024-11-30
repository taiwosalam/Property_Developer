"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  wrap,
  swipePower,
  swipeConfidenceThreshold,
  variants,
} from "@/utils/slider";
import { PreviousIcon, NextIcon, CameraIcon } from "@/public/icons/icons";

interface ImageSliderProps {
  images: string[];
  className?: string;
  showImageIndexOnHover?: boolean;
  children?: React.ReactNode;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  className,
  showImageIndexOnHover,
  children,
}) => {
  const NPButtonClasses =
    "w-6 h-6 rounded-full grid place-items-center absolute z-[2] top-1/2 transform -translate-y-1/2";
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);

  const paginate = (e: any, newDirection: number) => {
    e.preventDefault();
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        {
          group: showImageIndexOnHover,
        },
        className
      )}
      //   Make sure u pass height
    >
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="previous"
            className={cn(NPButtonClasses, "left-2")}
            style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
            onClick={(e) => paginate(e, -1)}
          >
            <PreviousIcon />
          </button>
          <button
            type="button"
            aria-label="next"
            className={cn(NPButtonClasses, "right-2")}
            style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
            onClick={(e) => paginate(e, 1)}
          >
            <NextIcon />
          </button>
        </>
      )}
      {/* Top left corner */}
      {images.length > 0 && (
        <div
          className={cn(
            "absolute z-[2] top-2 left-2 bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1",
            {
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300":
                showImageIndexOnHover,
            }
          )}
        >
          <CameraIcon width={16} height={16} />
          <span className="text-sm font-medium">
            {`${imageIndex + 1}/${images.length}`}
          </span>
        </div>
      )}
      {images.length > 0 ? (
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
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
            className="absolute inset-0"
          >
            <Image
              src={images[imageIndex]}
              alt={`image-${imageIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default ImageSlider;
