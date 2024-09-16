"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  wrap,
  //   variants as sliderVariants,
  swipeConfidenceThreshold,
  swipePower,
} from "@/utils/slider";
import { NextIcon, PreviousIcon } from "@/public/icons/icons";

const sliderVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
    };
  },
  center: {
    zIndex: 1,
    x: 0,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
    };
  },
};

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
}) => {
  const [[page, direction], setPage] = useState([currentIndex, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  const imageIndex = wrap(0, images.length, page);

  useEffect(() => {
    setPage([currentIndex, 0]);
  }, [currentIndex]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      //   className="mx-auto"
      //   fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div
        className="relative flex justify-center items-center overflow-hidden max-h-[85vh]"
        style={{ width: "min(900px, 80vw)" }}
      >
        <button
          type="button"
          aria-label="previous"
          className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] left-2 top-1/2 transform -translate-y-1/2"
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={() => paginate(-1)}
        >
          <PreviousIcon />
        </button>
        <button
          type="button"
          aria-label="next"
          className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] right-2 top-1/2 transform -translate-y-1/2"
          style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
          onClick={() => paginate(1)}
        >
          <NextIcon />
        </button>
        {/* Image Carousel */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            alt={`Image ${imageIndex + 1}`}
            custom={direction}
            variants={sliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              duration: 0.1,
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
            // className="absolute inset-0"
          />
        </AnimatePresence>
      </div>
    </Dialog>
  );
};

export default ImageModal;
