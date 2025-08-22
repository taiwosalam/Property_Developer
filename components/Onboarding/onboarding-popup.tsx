"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Images
import AngleDown from "@/public/icons/angle-down.svg";
import MessagesIcon from "@/public/icons/messages.svg";
import { OnboardingChatArrow } from "@/public/icons/icons";
// Imports
import gsap from "gsap";
import { secondaryFont } from "@/utils/fonts";
import OnboardingAction from "./onboarding-action";
import { SectionSeparator } from "../Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import OnboardingRequestCallback from "./onboardingRequestCallback";

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
    <div className="absolute w-[326px] bottom-10 right-10 lg:bottom-20 lg:right-20 custom-flex-col gap-3 cant-touch-at-all">
      {isOpen && (
        <div ref={containerRef} className="custom-flex-col opacity-0 can-touch">
          <div className="h-[340px] px-2 py-4 rounded-lg bg-brand-9 custom-flex-col justify-end gap-6">
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
              <OnboardingAction href="https://kb.ourproperty.ng/">
                Knowledge Base
              </OnboardingAction>
              <SectionSeparator />
              <Modal>
                <ModalTrigger asChild>
                  <OnboardingAction>request call</OnboardingAction>
                </ModalTrigger>
                <ModalContent>
                  <OnboardingRequestCallback />
                </ModalContent>
              </Modal>
              <SectionSeparator />
              <OnboardingAction href="https://ourproperty.com.ng/faq">
                FAQ
              </OnboardingAction>
            </div>
          </div>
          <div className="flex justify-end px-6">
            <span className="text-brand-9">
              <OnboardingChatArrow />
            </span>
          </div>
        </div>
      )}
      <div className="onboarding-help-wrapper flex justify-end px-4">
        <button
          onClick={handleClick}
          className="w-[60px] h-[60px] rounded-full bg-brand-9 flex items-center justify-center can-touch"
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
