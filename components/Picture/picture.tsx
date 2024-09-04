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
  status,
  rounded,
  className,
}) => {
  const status_wh = Math.min(12, Math.floor(size / 3));

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        className={clsx("object-cover", {
          "rounded-full": rounded,
          className,
        })}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
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
