import React from "react";
import Link from "next/link";

// Images
import Logout from "@/public/icons/logout.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import { getGreeting } from "./data";
import Picture from "../Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import { profile_links } from "@/app/(nav)/notifications/data";
import { SectionSeparator } from "../Section/section-components";

const NavProfileDropdown = () => {
  const { isMobile } = useWindowWidth();

  return (
    <>
      <div className="custom-flex-col">
        <div className="flex items-center gap-4 p-4">
          <Picture
            src={Avatar}
            alt="profile picture"
            size={isMobile ? 50 : 60}
            status
          />
          <div className="custom-flex-col text-text-secondary font-medium">
            <p className="text-xs font-normal">{getGreeting()},</p>
            <p>Mr Taiwo Salam</p>
            <p>ID: 1234567890096</p>
          </div>
        </div>
        <SectionSeparator />
      </div>
      {profile_links.map((link, index) => (
        <Link
          className="py-2 px-5 sm:py-3 sm:px-[30px] text-text-primary hover:bg-neutral-2"
          key={index}
          href={""}
        >
          {link}
        </Link>
      ))}
      <Link
        className="flex gap-2 py-2 px-5 sm:py-3 sm:px-[30px] text-status-error-primary hover:bg-neutral-2"
        href={""}
      >
        <Picture src={Logout} alt="logout" size={24} />
        logout
      </Link>
    </>
  );
};

export default NavProfileDropdown;
