"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Images
import AngleDown from "@/public/icons/angle-down.svg";
import MessagesIcon from "@/public/icons/messages.svg";
import OnboardingChatArrow from "@/public/icons/onboarding-chat-arrow.svg";

// Imports
import gsap from "gsap";
import { secondaryFont } from "@/utils/fonts";
import OnboardingAction from "./onboarding-action";
import { SectionSeparator } from "../Section/section-components";

const OnboardingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isOpen) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
      });
    }
  }, [isOpen]);

  return (
    <div className="absolute w-[326px] bottom-20 right-20 custom-flex-col gap-3 cant-touch-at-all">
      {isOpen && (
        <div ref={containerRef} className="custom-flex-col opacity-0 can-touch">
          <div className="h-[340px] px-2 py-4 rounded-lg bg-brand-primary custom-flex-col justify-end gap-6">
            <div className="px-6">
              <h1
                className={`text-white text-2xl font-bold ${secondaryFont.className}`}
              >
                Hey!
                <br />
                how can we help?
              </h1>
            </div>
            <div className="py-[18px] custom-flex-col rounded-lg bg-white">
              <OnboardingAction>assistance & support</OnboardingAction>
              <SectionSeparator />
              <OnboardingAction>request call</OnboardingAction>
              <SectionSeparator />
              <OnboardingAction>FAQ</OnboardingAction>
            </div>
          </div>
          <div className="flex justify-end px-6">
            <Image
              src={OnboardingChatArrow}
              alt="arrow"
              height={23}
              className="h-[23px]"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end px-4">
        <button
          onClick={handleClick}
          className="w-[60px] h-[60px] rounded-full bg-brand-primary flex items-center justify-center can-touch"
        >
          <Image
            alt="help"
            width={24}
            src={isOpen ? AngleDown : MessagesIcon}
          />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPopup;
