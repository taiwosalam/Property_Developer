"use client";
import Image from "next/image";
import clsx from "clsx";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  variants,
  swipeConfidenceThreshold,
  wrap,
  swipePower,
} from "@/utils/slider";
import {
  LocationIcon,
  PlayIconButton,
  PreviousIcon,
  NextIcon,
} from "@/public/icons/icons";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import BackButton from "@/components/BackButton/back-button";
import PropertySwitchUnitItem from "@/components/Management/Rent And Unit/Edit-Rent/property-switch-unit-item";
import Button from "@/components/Form/Button/button";
import PostProceedContent from "@/components/Management/Rent And Unit/Edit-Rent/PostProceedContent";

const images: string[] = [];

const ChangePropertyPage: React.FC = () => {
  const [step1Done, setStep1Done] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, images.length, page);
  const handleChangeContent = () => {
    setStep1Done(true);
  };

  if (step1Done) {
    return <PostProceedContent />;
  }

  return (
    <div className="space-y-5 pb-24">
      <BackButton as="h1">Change Tenants Property</BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: 123456789
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Moniya Apartment (14Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
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
                "w-6 h-6 rounded-full grid place-items-center absolute z-[2] left-2 top-1/2 transform -translate-y-1/2"
              )}
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={() => paginate(-1)}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              aria-label="next"
              className={clsx(
                "w-6 h-6 rounded-full grid place-items-center absolute z-[2] right-2 top-1/2 transform -translate-y-1/2"
              )}
              style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              onClick={() => paginate(1)}
            >
              <NextIcon />
            </button>
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={"/empty/SampleProperty3.jpeg"}
                alt={`${"property name prop"} ${imageIndex + 1}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0"
              />
            </AnimatePresence>
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
                src={"/empty/SampleProperty3.jpeg"}
                alt={""}
                fill
                className="object-center"
              />
            </div>
          </div>
        </div>

        <div className="lg:w-[37.5%]">
          <div className="bg-white dark:bg-darkText-primary p-4 md:p-6 lg:p-8 rounded-b-3xl mt-4 lg:mt-0 space-y-2">
            {/* Property Details */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Details</h3>
              <div>
                <p className="text-[#747474] dark:text-white">Property Title</p>
                <p className="text-black dark:text-darkText-1">
                  Harmony Cottage
                </p>
              </div>
              {/* Additional Property Details here */}
            </div>

            {/* Property Settings */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Settings</h3>
              <div>
                <p className="text-[#747474] dark:text-white">Agency Fee</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              {/* Additional Property Settings here */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[#092C4C] text-xl font-bold">
          Select New Unit For Tenant
        </p>
      </div>
      <section className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <PropertySwitchUnitItem key={index} />
        ))}
      </section>
      <div className="fixed w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white dark:bg-darkText-primary flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
        <Button onClick={handleChangeContent} type="submit">
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ChangePropertyPage;
