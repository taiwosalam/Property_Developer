"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// Icons and Images
import Cancel from "@/public/icons/cancel.svg";
import { AiIcon, SponsorIcon } from "@/public/icons/icons";

// Utilities
import gsap from "gsap";
import { trackOutsideClick } from "@/utils/track-outside-click";

// Components
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import useTextGenerator from "@/hooks/useAIContentGenerator";

const AIPopOver = ({
  editorValue,
  setEditorValue,
  autoPop,
}: {
  editorValue: string;
  setEditorValue: any;
  autoPop: any;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(autoPop);

    // Sync `autoPop` prop with `showPopover` state
    useEffect(() => {
      setShowPopover(autoPop);
    }, [autoPop]);
  

  const popoverRef = useRef(null);
  const containerRef = useRef(null);

  // Close Popover Handler
  const closePopover = useCallback(() => {
    if (showPopover) setShowPopover(false);
  }, [showPopover]);

  // Proceed Button Handler
  const proceedAction = () => {
    setShowPopover(false);
    setModalOpen(true);
  };

  // GSAP Animation for Popover
  useEffect(() => {
    if (!popoverRef.current) return;

    const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showPopover) {
      timeline
        .set(popoverRef.current, { display: "flex", autoAlpha: 0 })
        .to(popoverRef.current, { autoAlpha: 1, y: -20 });
      trackOutsideClick(containerRef, closePopover);
    } else {
      timeline
        .to(popoverRef.current, { autoAlpha: 0, y: 0 })
        .set(popoverRef.current, { display: "none" });
    }
  }, [showPopover, closePopover]);

  const { content, error, loading, generateText } = useTextGenerator();

  const ai_features = [
    // { label: "Generate Content", task: "Generate a summary of the input text." },
    { label: "Elaborate Content", task: "Expand the input text with detailed explanations." },
    { label: "List and Explain", task: "Create a list of points from the input and explain them." },
    { label: "Rewrite and Expand", task: "Rewrite and expand the input text." },
    { label: "Explain in Paragraph", task: "Explain the content in a clear paragraph." },
  ];
  
  const handleGenerate = async (task: string) => {
    try {
      await generateText(task, editorValue || ""); // Trigger the generation
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };
  
  // Watch for content updates and set editorValue
  useEffect(() => {
    if (content) {
      setEditorValue(content);
    }
  }, [content, setEditorValue]);
  
  return (
    <div ref={containerRef} className="relative dm-sans">
      {/* Popover Content */}
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute bottom-full left-2/4 -translate-x-2/4 custom-flex-col w-[154px]"
        >
          <div className="p-3 w-full rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3c3d37] custom-flex-col shadow-lg">
            <h2 className="text-text-label text-xs font-semibold">AI Content Creator</h2>
              {ai_features.map((feature: any, index: any) => (
                <button
                  key={index}
                  type="button"
                  className={`!w-full !flex !text-start !items-center !py-2 !font-[300] !text-[10px] !px-1 !text-white mt-2 rounded-md ${editorValue
                    ? "!bg-[#CBD5E0] !text-[#3F4247] hover:bg-blue-600"
                    : "!bg-[#F5F5F5] !text-[#3F4247] !cursor-not-allowed"
                    }`}
                  onClick={() => handleGenerate(feature.task)}
                  disabled={!editorValue || loading}
                >
                  {loading ? "Please wait..." : feature.label}
                </button>
              ))}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="19"
            viewBox="0 0 32 19"
            fill="none"
          >
            <path d="M0 0L16 19L32 0H0Z" fill="#FAFAFA" />
          </svg>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className="flex gap-2 capitalize text-start text-black dark:text-white"
        onClick={() => setShowPopover((prev: any) => !prev)}
      >
        <AiIcon />
      </button>
    </div>
  );
};

export default AIPopOver;
