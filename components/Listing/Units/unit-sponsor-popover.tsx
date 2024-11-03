"use client";

import React, { use, useCallback, useEffect, useRef, useState } from "react";

// Images
import Cancel from "@/public/icons/cancel.svg";
import Sponsor from "@/public/icons/sponsor.svg";

// Imports
import gsap from "gsap";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { trackOutsideClick } from "@/utils/track-outside-click";
import { SponsorIcon } from "@/public/icons/icons";

const UnitSponsorPopover = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const popover = useRef(null);
  const continer = useRef(null);

  const close = useCallback(() => {
    if (showPopover) setShowPopover(false);
  }, [showPopover]);

  const proceed = () => {
    setShowPopover(false);
    setModalOpen(true);
  };

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (showPopover) {
      timeline
        .set(popover.current, { display: "flex", autoAlpha: 0 })
        .to(popover.current, { autoAlpha: 1, y: -20 })
        .call(() => {
          trackOutsideClick(continer, close);
        });
    } else {
      timeline
        .to(popover.current, { autoAlpha: 0, y: 0 })
        .set(popover.current, { display: "none" });
    }
  }, [showPopover, close]);

  return (
    <div ref={continer} className="relative dm-sans">
      {/* Popover */}
      <div
        ref={popover}
        className="absolute bottom-full left-2/4 -translate-x-2/4 custom-flex-col max-w-[394px]"
        style={{ display: "none" }}
      >
        <div className="p-6 rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3c3d37] custom-flex-col gap-6 shadow-lg">
          <div className="custom-flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-text-primary dark:text-white text-base font-bold">
                Promote this Property
              </p>
              <button onClick={close}>
                <Picture src={Cancel} alt="cancel" size={24} />
              </button>
            </div>
            <p className="text-[#A4A7B0] dark:text-darkText-1 text-sm font-normal">
              The sponsor will prioritize it to appear first to all users, rank
              higher for potential, and automatically renew and update the
              listings.
            </p>
          </div>
          <div className="flex items-center text-base gap-2">
            <div className="p-2 rounded-[4px] bg-support-2">
              <p className="text-brand-disabled font-bold">34</p>
            </div>
            <p className="text-black dark:text-white font-normal">
              Available sponsor units
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={close}
              size="sm_medium"
              variant="change"
              className="py-2 px-8"
            >
              cancel
            </Button>
            <Button onClick={proceed} size="sm_medium" className="py-2 px-8">
              proceed
            </Button>
          </div>
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
      {/* Visible sponsor button */}
      <button
        className="flex gap-2 capitalize text-start"
        onClick={() => setShowPopover((prev) => !prev)}
      >
        <SponsorIcon />
        <p>sponsor</p>
      </button>
      {/* Modal is used to display the success message */}
      {/* Only visible when the user clicks "proceed" */}
      <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          <ModalPreset type="success" className="max-w-[326px]">
            <p className="text-text-disabled text-sm font-normal">
              You have successfully activated the sponsorship on this advert.
              This action cannot be undone.
            </p>
            <div className="flex justify-center">
              <ModalTrigger close asChild>
                <Button>ok</Button>
              </ModalTrigger>
            </div>
          </ModalPreset>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UnitSponsorPopover;
