"use client";
import { useState } from "react";
import Image from "next/image";
import { PropertyProps } from "./types";
import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import Sample from "@/public/empty/SampleProperty.jpeg";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import ImageModal from "@/components/ImageModal/image-modal";
import { VideoIcon, CameraIcon } from "@/public/icons/icons";

const PropertyListItem: React.FC<PropertyProps> = ({
  id,
  images,
  propertyId,
  name,
  units,
  address,
  price,
  type,
}) => {
  const [screenModal, setScreenModal] = useState(false);
  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <ImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={sampleImages.map((image, i) => ({
          src: image.src,
          isVideo: false,
        }))}
        currentIndex={0}
      />
      <div className="flex items-center gap-4 justify-between overflow-y-auto custom-round-scrollbar">
        <div className="flex-grow-1 flex-shrink-0 text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[170px,1fr] xl:max-w-[calc(100%-220px-16px)] w-fit">
          <div>
            <p className="text-[#747474] dark:text-white">Last Updated</p>
            <p className="text-black dark:text-darkText-2">23/04/2023</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Annual Returns</p>
            <p className="text-brand-primary font-bold dark:text-brand-9">₦1,950,000</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Total Units</p>
            <p className="text-black dark:text-darkText-2">14 Units</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Annual Income</p>
            <p className="text-highlight font-bold dark:text-highlight">₦700,000</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Available Units</p>
            <p className="text-black dark:text-darkText-2">Abiola Moniya</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Branch</p>
            <p className="text-black dark:text-darkText-2">Moniya Appartment</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Mobile Tenants</p>
            <p className="text-black dark:text-darkText-2">12</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Account Officer</p>
            <p className="text-black dark:text-darkText-2">Anikulapo Jesus</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Web Tenants</p>
            <p className="text-black dark:text-darkText-2">5</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Address</p>
            <p className="text-black dark:text-darkText-2">Newly Built 5 Bedroom Detached Duplex</p>
          </div>
        </div>

        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer flex-shrink-0">
          <div
            role="button"
            className="absolute z-[10] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setScreenModal(true)}
          >
            {/* Gropu of icons down */}
            <div className="flex items-stretch gap-[10px] absolute z-[1] left-[35%] bottom-4">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">+23</p>
              </div>
              <div className="bg-brand-1 rounded py-1 px-1.5 grid place-items-center">
                <VideoIcon />
              </div>
            </div>
          </div>
          <Image src={Sample} alt={name} fill className="object-cover" />
        </div>
      </div>

      <hr className="my-4" />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <p
            className={clsx(
              "px-4 py-1 text-[10px] font-normal rounded-lg",
              type === "rent"
                ? "text-status-success-3 bg-status-success-1"
                : "text-brand-9 bg-brand-3"
            )}
          >
            {type === "rent" ? "Rental Property" : "Gated Estate"}
          </p>
          <p className="font-bold text-sm md:text-base text-brand-10">
            ID: 123456776342
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="mid"
            className="!py-[5px] !px-5 md:!py-[8px] md:!px-8 !font-bold !bg-white !border-2 !border-brand-9 !text-brand-9 hover:opacity-70"
            href={`/management/properties/${id}/edit-property`}
          >
            Manage
          </Button>
          <Button
            type="button"
            size="mid"
            className="!py-[5px] !px-5 md:!py-[8px] md:!px-8 !font-bold"
            href={`/management/properties/${id}`}
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
