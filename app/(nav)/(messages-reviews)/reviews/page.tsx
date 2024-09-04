"use client";

import React from "react";
import Image from "next/image";

// Images
import LogoPlaceholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Button from "@/components/Form/Button/button";

const Reviews = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[80%]">
        <div className="custom-flex-col gap-4">
          <div className="flex justify-center">
            <Image src={LogoPlaceholder} alt="logo" width={200} />
          </div>
          <p className="text-center text-text-quaternary text-sm font-normal">
            To view more details about a review, kindly click on the particular
            review to see full details
          </p>
        </div>
        <div className="flex justify-center">
          <Button size="sm_medium" className="py-2 px-7">
            Copy Your Review Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
