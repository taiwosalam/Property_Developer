import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ReactPlayer from "react-player";
import { CameraIcon, ChevronLeft } from "@/public/icons/icons";
import { PropertyImageSliderProps } from "../Management/Rent And Unit/types";

export const CommunitySlider: React.FC<PropertyImageSliderProps> = ({
  images,
  showOverlay,
  video_link,
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

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div ref={sliderRef} className="keen-slider relative h-full w-full">
      {video_link && (
        <div className="keen-slider__slide h-full relative w-full">
          <ReactPlayer
            url={video_link}
            playing={isVideoPlaying}
            controls
            width="100%"
            height="100%"
            className="object-cover object-center"
            onEnded={handleVideoEnded}
            config={{
              youtube: {
                playerVars: {
                  rel: 0, // Disable related videos
                  modestbranding: 1, // Minimal YouTube branding
                  disablekb: 1, // Disable keyboard controls
                  fs: 0, // Disable fullscreen button
                  showinfo: 0, // Hide video information
                  iv_load_policy: 3, // Disable annotations
                  origin: window.location.origin, // Specify the origin for security
                },
              },
            }}
          />
          {!isVideoPlaying && (
            <button
              aria-label="Play Video"
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg"
            >
              ▶ Play Video
            </button>
          )}
        </div>
      )}
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
                {currentSlide +
                  1 +
                  "/" +
                  (images.length + (video_link ? 1 : 0))}
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
