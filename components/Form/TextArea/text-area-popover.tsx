"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// Icons and Images
import Cancel from "@/public/icons/cancel.svg";
import { AiIcon, SponsorIcon } from "@/public/icons/icons";

// Utilities
import gsap from "gsap";
import { trackOutsideClick } from "@/utils/track-outside-click";
import useTextGenerator, { formatAIResponse } from "@/hooks/useAIContentGenerator";
import { toast } from "sonner";


const AIPopOver = ({
  editorValue,
  setEditorValue,
  showAiCreator,
  setShowAiCreator, 
}: {
  editorValue: string;
  setEditorValue: any;
  showAiCreator: any;
  setShowAiCreator: any;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const containerRef = useRef(null);

  // Close Popover Handler
  const closePopover = useCallback(() => {
    if (showAiCreator) setShowAiCreator(false);
  }, [showAiCreator]);

  // Proceed Button Handler
  const proceedAction = () => {
    setShowAiCreator(false);
    setModalOpen(true);
  };

  // GSAP Animation for Popover
  useEffect(() => {
    if (!popoverRef.current) return;

    const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showAiCreator) {
      timeline
        .set(popoverRef.current, { display: "flex", autoAlpha: 0 })
        .to(popoverRef.current, { autoAlpha: 1, y: -20 });
      trackOutsideClick(containerRef, closePopover);
    } else {
      timeline
        .to(popoverRef.current, { autoAlpha: 0, y: 0 })
        .set(popoverRef.current, { display: "none" });
    }
  }, [showAiCreator, closePopover]);

  const handleShowPopOver = ()=> {
    if (editorValue.length < 30){
      toast.error("Please enter more than 30 characters to get AI suggestions.")
    } else {
      setShowAiCreator((prev: any) => !prev);
    }
  }

  const { content, loading, generateText } = useTextGenerator();

  const ai_features = [
    { label: "Elaborate Content", task: "Expand the input text with detailed explanations." },
    { label: "List and Explain", task: "Create a list of points from the input and explain them." },
    { label: "Rewrite and Expand", task: "Rewrite and expand the input text." },
    { label: "Explain in Paragraph", task: "Explain the content in a clear paragraph." },
  ];

  const handleGenerate = async (label: string) => {
    try {
      const feature = ai_features.find((feature) => feature.label === label);
      if (!feature) return;

      console.log("Feature Selected: ", feature)
      await generateText(feature.task, editorValue || ""); // Trigger the generation
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  // Watch for content updates and set editorValue with formatted content
  useEffect(() => {
    if (content) {
      console.log("Formatted content", content)
      setEditorValue(content); // Update editorValue only when contentGenerated changes
      
    }
  }, [setEditorValue, content]);

  return (
    <div ref={containerRef} className="relative dm-sans">
      {/* Popover Content */}
      {showAiCreator && (
        <div
          ref={popoverRef}
          className="absolute bottom-full left-2/4 -translate-x-2/4 custom-flex-col w-[154px]"
        >
          <div className="p-3 w-full rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3c3d37] custom-flex-col shadow-lg">
            <h2 className="text-text-label text-xs font-semibold dark:text-white">AI Content Creator</h2>
            {ai_features.map((feature: any, index: any) => (
              <button
                key={index}
                type="button"
                // style={{backgroundColor: "var(--secondary-color)"}}
                className={`!w-full !flex !text-start !items-center !py-2 !font-[300] !text-[10px] !px-1 !text-white mt-2 rounded-md ${editorValue
                  ? "!bg-brand-9 !text-[#3F4247] hover:bg-blue-600"
                  : "!bg-brand-9 !text-[#3F4247] !cursor-not-allowed"
                  }`}
                onClick={() => handleGenerate(feature.label)}
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
            className="text-white dark:text-darktext-primary"
          >
            <path d="M0 0L16 19L32 0H0Z" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className="flex gap-2 capitalize text-start text-black dark:text-white"
        onClick={handleShowPopOver}
      >
        <AiIcon />
      </button>
    </div>
  );
};

export default AIPopOver;
