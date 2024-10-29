"use client";
import { useState } from "react";
import clsx from "clsx";
import { CameraIcon } from "@/public/icons/icons";
import Image from "next/image";
import Sample from "@/public/empty/SampleProperty.jpeg";
import { SectionSeparator } from "@/components/Section/section-components";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
const UnitItem = ({ type = "rental" }: { type?: "rental" | "gated" }) => {
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };
  const [screenModal, setScreenModal] = useState(false);
  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={sampleImages.map((image) => ({
          src: image.src,
          isVideo: false,
        }))}
        currentIndex={0}
      />
      <div className="flex items-center justify-between">
        <h4 className="text-brand-10 text-base font-bold">
          Unit ID: 123456776342
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: colors["vacant"] }}
          ></div>
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: colors["occupied"] }}
          ></div>
        </div>
      </div>
      {/* <hr className="my-4 " /> */}
      <SectionSeparator className="my-4 h-[2px]" />
      <div className="flex items-center gap-2 justify-between overflow-y-auto custom-round-scrollbar pb-2">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
          <div>
            <p className="text-[#747474] dark:text-white">Unit Details</p>
            <p className="text-black dark:text-darkText-1">
              Newly Built 5 Bedroom Detached Duplex
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Rent</p>
            <p className="text-black dark:text-darkText-1">₦300,000</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit No/Name</p>
            <p className="text-black dark:text-darkText-1">Flat 4</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Caution Deposit</p>
            <p className="text-black dark:text-darkText-1">₦300,000</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit Description</p>
            <p className="text-black dark:text-darkText-1">Abiola Moniya</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Service Charge</p>
            <p className="text-black dark:text-darkText-1">₦300,000</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Tenants Name</p>
            <p className="text-black dark:text-darkText-1 underline underline-offset-4 flex items-center">
              David Ajala <BadgeIcon color="red" />
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Due Date</p>
            <p className="text-black dark:text-darkText-1">12/12/2024</p>
          </div>
        </div>

        {/* Image */}
        <div
          role="button"
          className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
          onClick={() => setScreenModal(true)}
        >
          <div className="absolute z-[1] left-[50%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+23</p>
          </div>
          <Image
            src={Sample}
            alt={""}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      <SectionSeparator className="my-4 h-[2px]" />
      <p
        className={clsx(
          "px-4 py-1 text-[10px] font-normal rounded-lg w-fit",
          type === "rental"
            ? "text-status-success-3 bg-status-success-1"
            : "text-brand-9 bg-brand-3"
        )}
      >
        {type === "rental" ? "Rental Property" : "Gated Estate"}
      </p>
    </div>
  );
};

export default UnitItem;
