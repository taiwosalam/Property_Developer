"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Sample from "@/public/empty/SampleProperty.jpeg";
import {
  ChevronLeft,
  LocationIcon,
  PlayIconButton,
  PreviousIcon,
  NextIcon,
} from "@/public/icons/icons";
import UnitItem from "./unit-item";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";

const PropertyPreview = () => {
  const router = useRouter();
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };

  const goBack = () => {
    router.back();
  };
  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleNextClick = () => {
    if (currentImageIndex < sampleImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100 && currentImageIndex > 0) {
      handlePreviousClick();
    } else if (
      info.offset.x < -100 &&
      currentImageIndex < sampleImages.length - 1
    ) {
      handleNextClick();
    }
  };

  return (
    <div>
      {/* Back Button & Preview Title */}
      <div className="flex items-center gap-1 mb-6 lg:mb-9">
        <button
          type="button"
          aria-label="Go Back"
          onClick={goBack}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">Preview</p>
      </div>

      {/* Heading */}
      <div className="text-black">
        <p className="text-base font-medium">ID: 123456789</p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Moniya Apartment (14Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1 mb-6 lg:mb-11">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
      </div>

      <div className="lg:flex gap-[2.5%]">
        <div className="lg:w-[60%]">
          {/* Main Image */}
          <div className="relative aspect-[1.4] overflow-hidden rounded-lg">
            <button
              type="button"
              aria-label="previous"
              className={clsx(
                "w-6 h-6 rounded-full grid place-items-center absolute z-[1] left-2 top-1/2 transform -translate-y-1/2",
                currentImageIndex === 0 && "opacity-80"
              )}
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={handlePreviousClick}
              disabled={currentImageIndex === 0}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              aria-label="next"
              className={clsx(
                "w-6 h-6 rounded-full grid place-items-center absolute z-[1] right-2 top-1/2 transform -translate-y-1/2",
                currentImageIndex === sampleImages.length - 1 && "opacity-80"
              )}
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={handleNextClick}
              disabled={currentImageIndex === sampleImages.length - 1}
            >
              <NextIcon />
            </button>

            <motion.div
              key={currentImageIndex}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0"
            >
              <Image
                src={sampleImages[currentImageIndex]}
                alt={`${name} ${currentImageIndex + 1}`}
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Videos */}
          <div>
            <p className="text-black text-lg md:text-xl lg:text-2xl font-bold my-6">
              Videos
            </p>
            <div className="relative aspect-[1.85] overflow-hidden rounded-xl max-w-[330px] max-h-[180px]">
              <div
                className="absolute inset-0 bg-black opacity-50 z-[1]"
                aria-hidden="true"
              ></div>
              <button
                type="button"
                aria-label="Play Video"
                className="absolute inset-0 flex items-center justify-center z-[2] text-white"
              >
                <PlayIconButton />
              </button>
              <Image
                src={Sample}
                alt={""}
                fill
                objectFit="cover"
                objectPosition="center"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:w-[37.5%]">
          <div className="bg-white p-4 md:p-6 lg:p-8 rounded-b-3xl mt-4 lg:mt-0 space-y-2">
            {/* Property Details */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Details</h3>
              <div>
                <p className="text-[#747474]">Property Title</p>
                <p className="text-black">Harmony Cottage</p>
              </div>
              <div>
                <p className="text-[#747474]">Landlord</p>
                <p className="text-black">Abiola Sunday</p>
              </div>
              <div>
                <p className="text-[#747474]">Description</p>
                <p className="text-black">+2348132086958</p>
              </div>
              <div>
                <p className="text-[#747474]">State</p>
                <p className="text-black">Oyo</p>
              </div>
              <div>
                <p className="text-[#747474]">Categories</p>
                <p className="text-black">Moniya Apartment</p>
              </div>
              <div>
                <p className="text-[#747474]">Blocks of Flat</p>
                <p className="text-black">Ibadan North</p>
              </div>
              <div>
                <p className="text-[#747474]">Account Officer</p>
                <p className="text-black">Sunday Ogunwole</p>
              </div>
            </div>

            {/* Property Settings */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Settings</h3>
              <div>
                <p className="text-[#747474]">Agency Fee</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Caution Deposit</p>
                <p className="text-black">N300,000</p>
              </div>
              <div>
                <p className="text-[#747474]">Period</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Group Chat</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Charge</p>
                <p className="text-black">Landlord</p>
              </div>
              <div>
                <p className="text-[#747474]">Agency Fee</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Book Visitors</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Request Call Back</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Vehicles Record</p>
                <p className="text-black">Yes</p>
              </div>
            </div>

            {/* Additional Details */}

            <div className="!mt-6 text-sm grid grid-cols-2 gap-4">
              <div>
                <p className="text-label font-normal">Branch</p>
                <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
              </div>
              <div>
                <p className="text-label font-normal">Total Unit</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Available Units</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-label font-normal">Account Officer</p>
                <p className="text-brand-9 font-bold">Anikulapo Jesus</p>
              </div>
              <div>
                <p className="text-label font-normal">Mobile Tenants</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Web Tenants</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-label font-normal">Last Updated</p>
                <p className="text-brand-9 font-bold">5 hours ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-y-2">
            {Object.entries(colors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <p className="text-xs text-[#6C6D6D] font-medium capitalize">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-4 space-y-4">
        {[...Array(4)].map((_, index) => (
          <UnitItem key={index} />
        ))}
      </section>
    </div>
  );
};

export default PropertyPreview;
