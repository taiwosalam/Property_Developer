"use client"

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import ReactPlayer from "react-player"; // For video & audio
import Image from "next/image"; // For images
import { FaFileAlt } from "react-icons/fa"; // File icon
import { OneCheckMark, TwoCheckMark } from "@/public/icons/icons";

import type { MessageProps } from "./types";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { MessageModalPreset } from "./message-attachments-components";
import useWindowWidth from "@/hooks/useWindowWidth";

const Message: React.FC<MessageProps> = ({
  text,
  seen,
  time,
  content_type,
  type = "from user",
}) => {
  const { isMobile } = useWindowWidth();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [text]); // Runs whenever text changes

  return (
    <div
      ref={messageRef}
      className={clsx("flex", { "justify-end": type === "from user" })}
    >
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
          <Modal>
            <ModalTrigger asChild>
              <div className="relative w-40 h-40 cursor-pointer">
                <Image
                  src={text}
                  alt="Sent Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md cursor-pointer"
                />
              </div>
            </ModalTrigger>
            <ModalContent>
              <MessageModalPreset
               style={{ width: isMobile ? "80%" : "50%", height: "60%" }}
              >
              <div className="relative w-full h-full mt-4">
                <Image
                  src={text}
                  alt="Sent Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              </MessageModalPreset>
            </ModalContent>
          </Modal>
        )}

        {/* Video Content */}
        {content_type === "video" && (
          <div className="w-60 h-40">
            <ReactPlayer url={text} controls width="100%" height="100%" />
          </div>
        )}

        {/* Audio Content */}
        {content_type === "audio" && (
          <div className="min-w-full">
            <audio controls>
              <source src={text} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* File / Document Content */}
        {(content_type === "file" || content_type === "document") && (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx("flex items-center gap-2", {
              "text-blue-500 hover:underline": content_type === "file",
              "hover:underline": content_type === "document",
              "text-white": type === "from user",
              "text-black": type === "to user",
            })}
          >
            <FaFileAlt size={20} />
            <span>Download File</span>
          </a>
        )}

        {/* Timestamp */}
        <div className="flex items-center self-end gap-1">
          <p
            className={clsx("text-[8px] font-normal", {
              "text-text-invert": type === "from user",
              "text-text-disabled": type === "to user",
            })}
          >
            {time}
          </p>
          {/* CHECKMARK */}
          {type === "from user" && (
            <p className="text-white">{seen ? <TwoCheckMark /> : <OneCheckMark />}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;