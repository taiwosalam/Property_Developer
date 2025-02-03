import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player"; // For video & audio
import Image from "next/image"; // For images
import { FaFileAlt } from "react-icons/fa"; // File icon
import WavesurferPlayer from "@wavesurfer/react"; // Wavesurfer component

// Import Types
import type { MessageProps } from "./types";
import AudioWaveform from "./audio-waveeform";

const Message: React.FC<MessageProps> = ({ text, time, content_type, type = "from user" }) => {
  return (
    <div className={clsx("flex", { "justify-end": type === "from user" })}>
      <div
        className={clsx("py-2 px-4 flex gap-4 rounded-2xl max-w-[70%]", {
          "bg-brand-primary rounded-tr-none": type === "from user",
          "bg-status-caution-1 rounded-tl-none": type === "to user",
        })}
      >
        {/* Text Content */}
        {content_type === "text" && (
          <p
            className={clsx("flex-1 text-sm font-normal", {
              "text-white": type === "from user",
              "text-text-quaternary": type === "to user",
            })}
          >
            {text}
          </p>
        )}

        {/* Image Content */}
        {content_type === "image" && (
          <div className="relative w-40 h-40">
            <Image
              src={text} // Assuming `text` contains the image URL
              alt="Sent Image"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}

        {/* Video Content */}
        {content_type === "video" && (
          <div className="w-60 h-40">
            <ReactPlayer url={text} controls width="100%" height="100%" />
          </div>
        )}

        {/* Audio Content with AudioWaveform */}
        {content_type === "audio" && (
          <div className="min-w-full">
            <audio controls>
              <source src={text} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

          </div>
        )}
        {/* Audio Content with AudioWaveform */}
        {/* {content_type === "audio" && (
          <div className="min-w-full">
            <AudioWaveform
              url={text} // `text` holds the audio URL
              options={{
                waveColor: "#ddd",
                progressColor: "#ff4500",
                cursorColor: "#333",
                height: 60,
                barWidth: 2,
              }}
            />
          </div>
        )} */}
        {/* File / Document Content */}
        {(content_type === "file" || content_type === "document") && (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx("flex items-center gap-2", {
              "text-blue-500 hover:underline": content_type === "file",
              "text-white hover:underline": content_type === "document",
            })}
          >
            <FaFileAlt size={20} />
            <span>Download File</span>
          </a>
        )}

        {/* Timestamp */}
        <div className="flex items-end">
          <p
            className={clsx("text-[10px] font-normal", {
              "text-text-invert": type === "from user",
              "text-text-disabled": type === "to user",
            })}
          >
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;