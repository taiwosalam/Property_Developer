"use client";
import Image from "next/image";
import { PropertyProps } from "./types";
import clsx from "clsx";
// import { useState } from "react";
import Button from "@/components/Form/Button/button";
// import { motion, useAnimation } from "framer-motion";
import Sample from "@/public/empty/SampleProperty.jpeg";
// import Sample2 from "@/public/empty/SampleProperty2.jpeg";
// import Sample3 from "@/public/empty/SampleProperty3.jpeg";
// import Sample4 from "@/public/empty/SampleProperty4.png";
// import Sample5 from "@/public/empty/SampleProperty5.jpg";

import {
  LocationIcon,
  NextIcon,
  PreviousIcon,
  VideoIcon,
  CameraIcon,
} from "@/public/icons/icons";

const PropertyListItem: React.FC<PropertyProps> = ({
  images,
  propertyId,
  name,
  units,
  address,
  price,
  type,
}) => {
  return (
    <div
      className="p-6 rounded-2xl bg-white"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-2">
        <div className="text-base grid grid-cols-2 gap-x-2 gap-y-4 flex-grow [&>div]:grid [&>div]:gap-x-2 [&>div]:grid-cols-[40%,1fr]">
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
            <p className="text-black">Newly Built 5 Bedroom Detached Duplex</p>
          </div>
        </div>
        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer">
          <div
            className="absolute z-[10] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
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
            {/* Top Icon */}
            <div className="absolute z-[1] left-[70%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black font-medium text-[10px]">+23</p>
            </div>
          </div>

          <Image
            src={Sample}
            alt={name}
            fill
            objectFit="cover"
            objectPosition="center"
            className="object-cover"
          />
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
          <p className="font-bold text-base text-brand-10">ID: 123456776342</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="mid"
            className="!py-[8px] !px-8 !font-bold !bg-white !border-2 !border-brand-9 !text-brand-9 hover:opacity-70"
          >
            Manage
          </Button>
          <Button
            type="button"
            size="mid"
            className="py-[8px] !px-8 !font-bold"
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
