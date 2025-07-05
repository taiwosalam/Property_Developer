"use client";
import { ChevronLeft, PlayIconButton2 } from "@/public/icons/icons";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import clsx from "clsx";
import PopupVideoModal from "@/components/VideoPlayer/PopupVideoModal";
import ReactPlayer from "react-player";
interface AttachedImagesGridProps {
  images: { src: string; isVideo: boolean }[];
}

const AttachedImagesGrid: React.FC<AttachedImagesGridProps> = ({ images }) => {
  const [showImages, setShowImages] = useState(true);
  const [screenModal, setScreenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const [videoModal, setVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const openModal = (index: number) => {
    const selected = images[index];

    if (selected.isVideo) {
      setVideoUrl(selected.src);
      setVideoModal(true);
    } else {
      setCurrentIndex(index);
      setTimeout(() => {
        setScreenModal(true);
      }, 0);
    }
  };

  // const openModal = (index: number) => {
  //   setCurrentIndex(index);
  //   setTimeout(() => {
  //     setScreenModal(true);
  //   }, 0);
  // };

  const imageOnly = images.filter((img) => !img.isVideo);
  const adjustedIndex = imageOnly.findIndex(
    (img, i) => images.indexOf(img) === currentIndex
  );

  return (
    <div className="space-y-4">
      {images && images.length > 0 && (
        <div className="w-full flex items-center justify-between">
          <h2 className="text-base font-medium">Attached Images</h2>
          <button
            type="button"
            className="flex items-center space-x-2 text-text-label text-sm font-medium"
            onClick={() => setShowImages(!showImages)}
          >
            <p>{showImages ? "Hide Images" : "Show Images"}</p>
            <div
              className={clsx(
                showImages ? "-rotate-90" : "rotate-90",
                "transition-transform"
              )}
            >
              <ChevronLeft fill="#5A5D61" />
            </div>
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {showImages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            key="images-grid"
            className="grid grid-cols-2 gap-4"
          >
            {images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="w-full md:h-[200px] h-[120px] xl:h-[115px] lg:h-[140px] bg-gray-200 rounded-lg relative overflow-hidden"
              >
                {!image.isVideo && (
                  <Image
                    src={image.src}
                    alt={`image-${index}`}
                    fill
                    sizes="auto"
                    priority
                    className="object-cover object-center cursor-pointer"
                    quality={60}
                    onClick={() => openModal(index)}
                    role="button"
                  />
                )}
                {image.isVideo && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => openModal(index)}
                    role="button"
                  >
                    <ReactPlayer
                      controls={false}
                      //onDisablePIP={}
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      light={true} // Show thumbnail only
                      playIcon={
                        <div className="flex items-center justify-center w-full h-full">
                          {/* Custom play button (optional) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 5v14l11-7L8 5z"
                            />
                          </svg>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            ))}
            {images.length > 3 && (
              <div className="w-full md:h-[200px] h-[120px] xl:h-[115px] lg:h-[140px] bg-gray-200 rounded-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => openModal(3)}
                  role="button"
                >
                  <span className="text-xl text-white">
                    + {images.length - 3}
                  </span>
                </div>
                <Image
                  src={images[3].src}
                  alt="image-3"
                  fill
                  sizes="auto"
                  priority
                  className="object-cover object-center cursor-pointer"
                  quality={60}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={imageOnly}
        currentIndex={adjustedIndex}
      />

      <PopupVideoModal
        isOpen={videoModal}
        videoUrl={videoUrl}
        onClose={() => setVideoModal(false)}
      />
    </div>
  );
};

export default AttachedImagesGrid;
