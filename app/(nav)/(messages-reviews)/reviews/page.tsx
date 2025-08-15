"use client";

import React from "react";
import Image from "next/image";

// Images
import LogoPlaceholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Button from "@/components/Form/Button/button";
import { getLocalStorage } from "@/utils/local-storage";
import { empty } from "@/app/config";

const Reviews = () => {
  const loggedInUserDetails = getLocalStorage("additional_details");
  const logo = loggedInUserDetails?.company?.company_logo;
  const theme = getLocalStorage("theme");

  const logoCompany =
    theme === "light"
      ? getLocalStorage("light_logo")
      : getLocalStorage("dark_logo") || empty;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[80%] justify-center items-center">
        <div className="custom-flex-col justify-center items-center gap-4">
          <div className="flex justify-center max-h-[100px] max-w-[100px]">
            <Image src={logo || logoCompany} alt="logo" height={200} width={200} />
          </div>
          <p className="text-center text-text-quaternary text-sm font-normal">
            To view more details about a review, kindly click on the particular
            review to see full details
          </p>
        </div>
        <div className="flex justify-center items-center">
          {/* <Button size="sm_medium" className="py-2 px-7">
            Copy Your Review Link
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
