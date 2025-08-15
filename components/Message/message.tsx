"use client";

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
import { formatMessageText } from "@/app/(nav)/(messages-reviews)/messages/data";
import { capitalizeWords } from "@/hooks/capitalize-words";

const nameColors = [
  "text-red-500",
  "text-pink-500",
  "text-yellow-500",
  "text-green-500",
  "text-blue-500",
  "text-purple-500",
  "text-orange-500",
  "text-teal-500",
];

function getColorClass(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nameColors[Math.abs(hash) % nameColors.length];
}

const Message: React.FC<MessageProps> = ({
  text,
  seen,
  time,
  content_type,
  type = "from user",
  noScroll,
  chat_type = "private",
  sender,
  showSenderInfo = true,
}) => {
  const { isMobile } = useWindowWidth();
  const messageRef = useRef<HTMLDivElement>(null);
  const AVATAR_SIZE = 32;
  useEffect(() => {
    if (!noScroll && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [text, noScroll]);

  return (
    <div
      ref={messageRef}
      className={clsx("flex", { "justify-end": type === "from user" })}
    >
      {chat_type === "group" && type === "to user" && (
        <div
          className="flex flex-col items-end justify-end mr-2"
          style={{
            width: AVATAR_SIZE,
            maxWidth: AVATAR_SIZE,
            maxHeight: AVATAR_SIZE,
          }}
        >
          {showSenderInfo && sender?.picture ? (
            <div
              className="rounded-full overflow-hidden mb-1"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              <Image
                src={sender.picture}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE }
                alt={sender?.fullname ?? "sender"}
                className="object-cover w-full h-full custom-secondary-bg rounded-full"
              />
            </div>
          ) : (
            <div style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}></div>
          )}
        </div>
      )}
      <div
        className={clsx("py-2 px-4 flex gap-4 rounded-2xl max-w-[70%]", {
          "bg-brand-primary rounded-tr-none": type === "from user",
          "bg-status-caution-1 rounded-tl-none": type === "to user",
        })}
      >
        <div className="custom-flex-col gap-1">
          {/* SENDER INFORMATION FOR GROUP CHAT */}
          {chat_type === "group" &&
            type === "to user" &&
            sender &&
            showSenderInfo && (
              <div className="flex flex-col items-start mr-2">
                <span
                  className={`text-[10px] font-normal ${getColorClass(
                    sender.fullname || ""
                  )}`}
                >
                  {capitalizeWords(sender?.title ?? "")}{" "}
                  {capitalizeWords(sender?.fullname ?? "")}
                </span>
              </div>
            )}

          <div className="flex gap-4">
            <div>
              {/* Text Content */}
              {content_type === "text" && (
                <div
                  className={clsx(
                    "flex-1 text-sm font-normal overflow-hidden break-words whitespace-pre-wrap max-w-full",
                    {
                      "text-white": type === "from user",
                      "text-text-quaternary": type === "to user",
                    }
                  )}
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(text),
                  }}
                  style={{ wordBreak: "break-word" }}
                />
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
                <div className="relative w-auto h-auto">
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
                  <span>Download File </span>
                </a>
              )}
            </div>
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
                <p className="text-white">
                  {seen ? <TwoCheckMark /> : <OneCheckMark />}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
