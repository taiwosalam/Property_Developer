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
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const images: string[] = [];

const ChangePropertyPage: React.FC = () => {
  const [step1Done, setStep1Done] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, images.length, page);

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id === selectedUnitId ? null : id);
  };

  const handleChangeContent = () => {
    setStep1Done(true);
  };

  if (step1Done) {
    return <PostProceedContent />;
  }

  return (
    <div className="space-y-5 pb-[100px]">
      <BackButton as="p">Change Tenants Property</BackButton>

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
                <p className="text-[#747474] dark:text-white">
                  {/* {type === "rental" ? "Property Title" : "Estate Name"} */}
                </p>
                <p className="text-black dark:text-darkText-1">
                  Harmony Cottage
                </p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Landlord</p>
                <p className="text-black dark:text-darkText-1">Abiola Sunday</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Description</p>
                <p className="text-black dark:text-darkText-1">
                  +2348132086958
                </p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">State</p>
                <p className="text-black dark:text-darkText-1">Oyo</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Categories</p>
                <p className="text-black dark:text-darkText-1">
                  Moniya Apartment
                </p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Blocks of Flat</p>
                <p className="text-black dark:text-darkText-1">Ibadan North</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Account Officer
                </p>
                <p className="text-black dark:text-darkText-1">
                  Sunday Ogunwole
                </p>
              </div>
            </div>

            {/* Property Settings */}
            <div className="text-base font-normal space-y-3 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Settings</h3>
              <div>
                <p className="text-[#747474] dark:text-white">Agency Fee</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Caution Deposit
                </p>
                <p className="text-black dark:text-darkText-1">N300,000</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Period</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Group Chat</p>
                <p className="text-black dark:text-darkText-1">Yes</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Charge</p>
                <p className="text-black dark:text-darkText-1">Landlord</p>
              </div>
            </div>

            {/* Additional Details */}

            <div className="!mt-6 text-sm grid grid-cols-2 gap-8">
              <div>
                <p className="text-label font-normal">Branch</p>
                <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
              </div>
              <div>
                <p className="text-label font-normal">Total Units</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Branch Manager</p>
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
              <div>
                <p className="text-label font-normal">Available Units</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-brand-primary text-xl font-bold">
                  {currencySymbols["NAIRA"]}
                  {formatNumber(700000)}
                </p>
                <p className="text-[#606060] font-normal text-xs">
                  {/* Annual Returns*/}
                </p>
                <p className="text-text-disabled font-medium text-sm">
                  <span className="text-highlight">
                    {currencySymbols["NAIRA"]}
                    {formatNumber(700000)}
                  </span>
                  / Annual Income
                </p>
              </div>
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
        {[...Array(4)].map((_, index) => {
          const unitId = `123456776342${index}`; // Generate unique IDs for test
          return (
            <PropertySwitchUnitItem
              key={index}
              id={unitId}
              isSelected={selectedUnitId === unitId}
              onSelect={handleUnitSelect}
            />
          );
        })}
      </section>
      <FixedFooter className="flex justify-end">
        <Button
          onClick={handleChangeContent}
          type="submit"
          className="py-2 px-6"
          size="base_medium"
          disabled={!selectedUnitId}
        >
          Proceed
        </Button>
      </FixedFooter>
    </div>
  );
};

export default ChangePropertyPage;
