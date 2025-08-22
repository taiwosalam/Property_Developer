"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Images
import Cancel from "@/public/icons/cancel.svg";
import { SponsorIcon } from "@/public/icons/icons";

// Imports
import gsap from "gsap";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { trackOutsideClick } from "@/utils/track-outside-click";
import BuySponsorModal from "@/components/Settings/Modals/buy-sponsor-modal";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { parseCurrencyToNumber, sponsorUnit } from "../data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

interface UnitSponsorPopoverProps {
  availableSponsors: number;
  unitId?: number;
  propertyName?: string;
  unitName?: string;
  unitDesc?: string;
  status?: string;
  annualRent?: number | string;
  is_sponsored?: boolean;
  sponsored_count: number;
}

const UnitSponsorPopover = ({
  availableSponsors,
  unitId,
  propertyName,
  unitName,
  unitDesc,
  status,
  annualRent,
  is_sponsored = true,
  sponsored_count
}: UnitSponsorPopoverProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";

  const title = is_sponsored
    ? "Sponsorship Already Activated"
    : availableSponsors > 0
    ? "Promote this Property"
    : "No Sponsorships Available";

  const description = is_sponsored
    ? "This unit is already sponsored and prioritized to appear first to all users, rank higher for potential tenants, and automatically renew and update listings."
    : availableSponsors > 0
    ? "The sponsor will prioritize it to appear first to all users, rank higher for potential, and automatically renew and update the listings."
    : "Sorry, you currently don't have any available sponsorships to apply to your property unit.";

  const popover = useRef(null);
  const continer = useRef(null);

  const close = useCallback(() => {
    if (showPopover) setShowPopover(false);
  }, [showPopover]);

  const handleOpen = () => {
    close();
    console.log("clicked");
    // setBuyModal(true)
  };

  const proceed = async () => {
    //if (is_sponsored) return; // Prevent proceeding if already sponsored

    const numericRent = parseCurrencyToNumber(annualRent as string);
    const payload = {
      company_id: companyId,
      unit_id: unitId,
      property_name: propertyName,
      unit_name: unitName,
      unit_description: unitDesc,
      status: status,
      annual_rent: numericRent,
    };

    try {
      setReqLoading(true);
      const res = await sponsorUnit(objectToFormData(payload));
      if (res) {
        setShowPopover(false);
        window.dispatchEvent(new Event("refetchRentSponsors"));
        window.dispatchEvent(new Event("refetchRentUnit"));
        setModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to sponsor Unit");
    } finally {
      setReqLoading(false);
    }
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
        <div className="p-6 min-w-[250px] rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3c3d37] custom-flex-col gap-6 shadow-lg">
          <div className="custom-flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-text-primary dark:text-white text-base font-bold">
                {title}
              </p>
              <button onClick={close}>
                <Picture src={Cancel} alt="cancel" size={24} />
              </button>
            </div>
            <p className="text-[#A4A7B0] dark:text-darkText-1 text-sm font-normal">
              {description}
            </p>
            {!is_sponsored && availableSponsors < 1 && (
              <p className="text-[#A4A7B0] dark:text-darkText-1 text-sm font-normal">
                To promote your listing and have it appear first to potential
                tenants and occupants, click on &apos;Buy Sponsor&apos; to
                subscribe and sponsor your unit.
              </p>
            )}
          </div>
          {/* {!is_sponsored && ( */}
          <div className="flex items-center text-base gap-2">
            <div className="p-2 rounded-[4px] bg-support-2">
              <p className="text-brand-disabled font-bold">
                {availableSponsors.toLocaleString()}
              </p>
            </div>
            <p className="text-black dark:text-white font-normal">
              Available sponsor units
            </p>
          </div>
          {/* // )} */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={close}
              size="sm_medium"
              variant="change"
              className="py-2 px-8"
            >
              Cancel
            </Button>
            {availableSponsors > 0 ? (
              <Button
                onClick={(e) => {
                  proceed();
                  e.preventDefault();
                  e.stopPropagation();
                }}
                size="sm_medium"
                className="py-2 px-8"
                disabled={reqLoading}
              >
                {reqLoading ? "Please wait" : "Proceed"}
              </Button>
            ) : !is_sponsored ? (
              <Modal state={{ isOpen: buyModal, setIsOpen: setBuyModal }}>
                <ModalTrigger asChild>
                  <Button
                    onClick={handleOpen}
                    size="sm_medium"
                    className="py-2 px-8"
                  >
                    Proceed
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <BuySponsorModal />
                </ModalContent>
              </Modal>
            ) : null}
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
        className="flex items-center gap-2 text-start"
        onClick={() => setShowPopover((prev) => !prev)}
      >
        <SponsorIcon />
        {
          sponsored_count > 0 ? <p className="hidden sm:block">Sponsored</p> : <p className="hidden sm:block">Sponsor</p>
        }
       {sponsored_count > 1 && <span>x{sponsored_count}</span>}
      </button>
      {/* Modal for success message */}
      <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          <ModalPreset type="success" className="max-w-[326px]">
            <p className="text-text-disabled text-sm font-normal">
              You have successfully activated the sponsorship on this advert.
              This action cannot be undone.
            </p>
            <div className="flex justify-center">
              <ModalTrigger close asChild>
                <Button>OK</Button>
              </ModalTrigger>
            </div>
          </ModalPreset>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UnitSponsorPopover;
