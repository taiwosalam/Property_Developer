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
        <div className="grid grid-cols-2 gap-2 flex-grow">
          <div>
            <p>Last Updated</p>
            <p>23/04/2023</p>
          </div>
          <div>
            <p>Total Units</p>
            <p>14 Units</p>
          </div>
          <div>
            <p>Available Units</p>
            <p>Abiola Moniya</p>
          </div>
          <div>
            <p>Mobile Tenants</p>
            <p>12</p>
          </div>
          <div>
            <p>Web Tenants</p>
            <p>5</p>
          </div>
          <div>
            <p>Annual Returns</p>
            <p>₦1,950,000</p>
          </div>
          <div>
            <p>₦1,950,000</p>
            <p>₦700,000</p>
          </div>
          <div>
            <p>Branch</p>
            <p>Moniya Appartment</p>
          </div>
          <div>
            <p>Account Officer</p>
            <p>Anikulapo Jesus</p>
          </div>
          <div>
            <p>Address</p>
            <p>Newly Built 5 Bedroom Detached Duplex</p>
          </div>
        </div>
        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden">
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
        <div className="flex items-center">
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
          <p>ID: 123456776342</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="mid"
            className="!py-[8px] !px-8 !font-bold"
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
