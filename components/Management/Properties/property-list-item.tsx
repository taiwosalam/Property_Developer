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
      className="p-6 rounded-2xl bg-white"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <ImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={sampleImages.map((image) => image.src)}
        currentIndex={0}
      />
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
        <div className="overflow-x-auto max-w-full flex-grow">
          <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[40%,1fr]">
            <div>
              <p className="text-[#747474]">Last Updated</p>
              <p className="text-black">23/04/2023</p>
            </div>
            <div>
              <p className="text-[#747474]">Annual Returns</p>
              <p className="text-brand-primary font-bold">₦1,950,000</p>
            </div>
            <div>
              <p className="text-[#747474]">Total Units</p>
              <p className="text-black">14 Units</p>
            </div>
            <div>
              <p className="text-[#747474]">Annual Income</p>
              <p className="text-highlight font-bold">₦700,000</p>
            </div>
            <div>
              <p className="text-[#747474]">Available Units</p>
              <p className="text-black">Abiola Moniya</p>
            </div>
            <div>
              <p className="text-[#747474]">Branch</p>
              <p>Moniya Appartment</p>
            </div>
            <div>
              <p className="text-[#747474]">Mobile Tenants</p>
              <p className="text-black">12</p>
            </div>
            <div>
              <p className="text-[#747474]">Account Officer</p>
              <p className="text-black">Anikulapo Jesus</p>
            </div>
            <div>
              <p className="text-[#747474]">Web Tenants</p>
              <p className="text-black">5</p>
            </div>
            <div>
              <p className="text-[#747474]">Address</p>
              <p className="text-black">
                Newly Built 5 Bedroom Detached Duplex
              </p>
            </div>
          </div>
        </div>
        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p
            className={clsx(
              "px-4 py-1 text-[10px] font-normal rounded-lg",
              type === "rent"
                ? "text-success-3 bg-success-1"
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
