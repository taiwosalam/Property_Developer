"use client";

import React, { useState, useEffect, useRef } from "react";
import { ModalTrigger, useModal } from "../Modal/modal";
import { CancelIcon, ChevronLeft } from "@/public/icons/icons";
import EmojiPicker from "emoji-picker-react";
import { AudioProps, EmojiComponentProps } from "./data";
import UploadMsgFile from "./msg-file-upload";
import { SendMessage } from "@/app/(nav)/(messages-reviews)/messages/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { useMessages } from "@/contexts/messageContext";

export const MessageModalPreset = ({
  back,
  children,
  heading,
  noheading,
  style,
}: {
  heading?: string;
  back?: { handleBack: () => void };
  children: React.ReactNode;
  noheading?: boolean;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={style}
      className="w-[400px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white dark:bg-darkText-primary p-[20px] custom-flex-col"
    >
      <div className="flex items-center justify-between border-b border-solid border-gray-300 ">
        <div className="flex items-center gap-2">
          {back && (
            <button type="button" onClick={back.handleBack} aria-label="back">
              <ChevronLeft />
            </button>
          )}
          {!noheading && (
            <h2 className="text-lg font-bold text-primary-navy dark:text-white">
              {heading}
            </h2>
          )}
        </div>
        <ModalTrigger close>
          <CancelIcon />
        </ModalTrigger>
      </div>
      {children}
    </div>
  );
};

export const MessageAudioComponent: React.FC<AudioProps> = ({ id }) => {
  const { handleSendAudio, reqLoading } = useMessages();
  const { setIsOpen } = useModal();

  const handleUpload = async (file: File) => {
    if (!file) return;
    try {
      await handleSendAudio(id, file);
      setIsOpen(false);
    } catch {
      toast.error("Failed to send audio message");
    }
  };

  return (
    <div className="mt-4">
      <UploadMsgFile
        submitAction={handleUpload}
        accept=".mp3"
        heading="Upload Sound/Music"
      />
    </div>
  );
};

export const EmojiComponent: React.FC<EmojiComponentProps> = ({
  onEmojiSelect,
}) => {
  const handleEmojiClick = (emojiData: any, event: MouseEvent) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="my-4">
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  );
};

export const MessageGalleryComponent = ({ id }: { id: string }) => {
  const { handleSendImage, reqLoading } = useMessages();
  const { setIsOpen } = useModal();

  const handleUpload = async (file: File) => {
    if (!file) return;
    try {
      await handleSendImage(id, file);
      setIsOpen(false);
    } catch {
      toast.error("Failed to send image");
    }
  };

  return (
    <div className="mt-4">
      <UploadMsgFile submitAction={handleUpload} accept=".jpg, .jpeg, .png" />
    </div>
  );
};

export const MessageDocumentComponent = ({ id }: { id: string }) => {
  const { handleSendDocument, reqLoading } = useMessages();
  const { setIsOpen } = useModal();

  const handleUpload = async (file: File) => {
    if (!file) return;
    try {
      await handleSendDocument(id, file);
      setIsOpen(false);
    } catch {
      toast.error("Failed to send document");
    }
  };
  return (
    <div className="mt-4">
      <UploadMsgFile
        submitAction={handleUpload}
        heading="Import Document"
        accept=".pdf, .clx, .csv, .docx, .txt, .doc"
      />
    </div>
  );
};
