"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { NextIcon, PreviousIcon, XIcon } from "@/public/icons/icons";
import { PopupImageModalProps } from "./types";
import Image from "next/image";

const PopupImageModal: React.FC<PopupImageModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
}) => {
  console.log(currentIndex);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: currentIndex,
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

  const triggerClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  }

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(currentIndex);
    }
  }, [currentIndex, instanceRef]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div
        className="relative flex justify-center items-center overflow-hidden h-[500px] max-h-[85vh]"
        style={{ width: "min(90vw, 900px)" }}
      >
        {loaded && (
          <>
            <button
              type="button"
              aria-label="previous"
              className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] left-2 top-1/2 transform -translate-y-1/2"
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              aria-label="next"
              className="w-6 h-6 rounded-full grid place-items-center absolute z-[2] right-2 top-1/2 transform -translate-y-1/2"
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
            >
              <NextIcon />
            </button>
          </>
        )}
        <div ref={sliderRef} className="keen-slider h-full w-full relative">
          {images.map((image, index) => (
            <div
              key={index}
              className="keen-slider__slide relative w-full h-full"
            >
              <Image
                src={image.src}
                alt={`Image ${index + 1}`}
                fill
                sizes="auto"
                priority={index === 0}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute top-10 right-10 cursor-pointer bg-white rounded-full bg-opacity-60" onClick={triggerClose}>
          <XIcon size="30" />
        </div>
      </div>
    </Dialog >
  );
};

export default PopupImageModal;
