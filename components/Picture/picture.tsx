import React from "react";
import Image from "next/image";

// Types
import type { PictureProps } from "./types";

// Imports
import clsx from "clsx";
import { empty } from "@/app/config";

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
  resolutionMultiplier = 2,
  containerClassName,
}) => {
  const imageWidth = width ?? size;
  const imageHeight = height ?? size;

  const status_wh = Math.min(12, Math.floor(size / 3));

  return (
    <div className={clsx("relative", containerClassName)}>
      <Image
        src={src}
        alt={alt}
        width={imageWidth * resolutionMultiplier}
        height={imageHeight * resolutionMultiplier}
        className={clsx(
          "object-cover",
          {
            "rounded-full": rounded,
          },
          className
        )}
        style={{
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
          className="absolute right-[5%] bottom-[5%] rounded-full bg-status-success-primary border border-solid border-white"
          style={{ width: status_wh, height: status_wh }}
        ></div>
      )}
    </div>
  );
};

export default Picture;
