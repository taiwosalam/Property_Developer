import Image from "next/image";

// Types
import type { PictureProps } from "./types";

// Imports
import clsx from "clsx";
import { empty } from "@/app/config";

const transformImageSrc = (src: string): string => {
  // Define invalid placeholders
  const invalidPlaceholders = ["___", "---", "", null, undefined];

  // Check if src is invalid or a placeholder
  if (!src || invalidPlaceholders.includes(src)) {
    return empty; // Fallback to the default empty image from config
  }

  // Basic validation for URL or file path
  // Check if src is a valid URL or a relative file path
  const isValidUrl = (str: string) => {
    try {
      // Check for valid URL (http, https, or data URLs)
      return (
        /^(https?:\/\/|data:image\/)/.test(str) ||
        /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str)
      );
    } catch {
      return false;
    }
  };

  // If src is a valid URL or file path, return it; otherwise, return the fallback
  return isValidUrl(src) ? src : empty;
};

const Picture: React.FC<PictureProps> = ({
  src = empty,
  alt = "profile picture",
  size = 60,
  width,
  height,
  style,
  status,
  rounded,
  className,
  fit = "cover",
  resolutionMultiplier = 2,
  containerClassName,
  onClick,
}) => {
  const imageWidth = width ?? size;
  const imageHeight = height ?? size;

  const status_wh = Math.min(12, Math.floor(size / 3));

  const transformedSrc = transformImageSrc(src);

  return (
    <div
      role={onClick ? "button" : undefined}
      className={clsx("relative", containerClassName)}
      onClick={onClick ? onClick : undefined}
    >
      <Image
        src={transformedSrc}
        alt={alt}
        width={imageWidth * resolutionMultiplier}
        height={imageHeight * resolutionMultiplier}
        className={clsx(
          {
            "rounded-full custom-secondary-bg": rounded,
          },
          className
        )}
        style={{
          objectFit: fit,
          // Dont change the below, abeg
          // The whole point of this component is to make sure the image is always square,
          // or that their defined width or height doesnt change
          // Let us be guided 😈
          // In that case stop using my components create yours  🤷‍♀️😒
          width: imageWidth,
          height: imageHeight,
          minWidth: imageWidth,
          minHeight: imageHeight,
          maxWidth: imageWidth,
          maxHeight: imageHeight,
          ...style,
        }}
      />
      {status && (
        <div
          className={`absolute right-[5%] bottom-[5%] rounded-full custom- ${
            status ? "bg-status-success-primary" : "bg-yellow-500"
          } border border-solid border-white`}
          style={{ width: status_wh, height: status_wh }}
        />
      )}
    </div>
  );
};

export default Picture;
