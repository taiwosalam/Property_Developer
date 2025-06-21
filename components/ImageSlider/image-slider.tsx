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
import { empty } from "@/app/config";
import dynamic from "next/dynamic";

const DynamicReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface ImageSliderProps {
  images: string[];
  className?: string;
  showImageIndexOnHover?: boolean;
  children?: React.ReactNode;
  dot?: boolean;
  default_image?: string;
  videoLink?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  className,
  showImageIndexOnHover,
  children,
  dot,
  default_image,
  videoLink,
}) => {
  // Total slides: images + 1 if videoLink exists
  const totalSlides = videoLink ? images.length + 1 : images.length;

  const goToImage = (index: number) => {
    setPage([index, index > imageIndex ? 1 : -1]);
  };

  const NPButtonClasses =
    "w-6 h-6 rounded-full grid place-items-center absolute z-[2] top-1/2 transform -translate-y-1/2";
  const [[page, direction], setPage] = useState([0, 0]);
  // Use totalSlides to allow video slide
  const imageIndex = wrap(0, totalSlides, page);

  const paginate = (e: any, newDirection: number) => {
    e.preventDefault();
    setPage([page + newDirection, newDirection]);
  };

  // Debugging: Log slide details
  console.log({
    imageIndex,
    totalSlides,
    isVideoSlide: imageIndex === images.length,
    videoLink,
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        { group: showImageIndexOnHover },
        className
      )}
    >
      {!dot && totalSlides > 1 && (
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
      {!dot && totalSlides > 0 && (
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
            {`${imageIndex + 1}/${totalSlides}`}
          </span>
        </div>
      )}
      {totalSlides > 0 ? (
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
            {imageIndex < images.length ? (
              <Image
                src={
                  imageIndex === 0
                    ? default_image || images[0]
                    : images[imageIndex] || empty
                }
                alt={`image-${imageIndex + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-black">
                <DynamicReactPlayer
                  url={videoLink}
                  width="100%"
                  height="100%"
                  controls
                  className="object-contain"
                  onError={(e) => console.error("Video player error:", e)}
                  onReady={() => console.log("Video player ready")}
                  config={{
                    youtube: {
                      playerVars: {
                        rel: 0, // Disable related videos
                        modestbranding: 1, // Minimal branding
                        disablekb: 1, // Disable keyboard controls
                        fs: 0, // Disable fullscreen
                        showinfo: 0, // Hide video info
                        iv_load_policy: 3, // Disable annotations
                        origin:
                          typeof window !== "undefined"
                            ? window.location.origin
                            : "",
                      },
                    },
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}
      {dot && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 z-[2]">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "rounded-full border border-gray-300 bg-brand-9",
                imageIndex === index
                  ? "bg-white w-5 h-5"
                  : "bg-gray-200 dark:bg-gray-600 w-3 h-3"
              )}
              onClick={() => goToImage(index)}
            ></button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export default ImageSlider;
