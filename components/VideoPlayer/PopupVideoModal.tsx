"use client";

import React, { useState } from "react";
import ReactPlayer from "react-player";
import { X } from "lucide-react"; // or any icon library you use
import clsx from "clsx";

interface PopupVideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  onClose: () => void;
}

const PopupVideoModal: React.FC<PopupVideoModalProps> = ({
  isOpen,
  videoUrl,
  onClose,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-xl bg-black/40">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-center px-4">
            <p>Unable to load video. The link may be broken or unsupported.</p>
          </div>
        ) : (
          <ReactPlayer
            url={videoUrl}
            controls
            playing
            width="100%"
            height="100%"
            onError={() => setHasError(true)}
          />
        )}

        {/* Close Button */}
        <button
          className={clsx(
            "absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full z-10"
          )}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PopupVideoModal;
