import Link from "next/link";

import Avatar from "@/public/empty/avatar.png";

// Imports
import { getGreeting } from "./data";
import Picture from "../Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import { profile_links } from "@/app/(nav)/notifications/data";
import { SectionSeparator } from "../Section/section-components";
import { logout } from "@/app/(onboarding)/auth/data";
import { LogoutIcon } from "@/public/icons/icons";

const NavProfileDropdown = ({
  name,
  userId,
}: {
  name: string;
  userId: number;
}) => {
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
            <p className="text-xs font-normal dark:text-darkText-2">{getGreeting()},</p>
            <p className="dark:text-white">{name}</p>
            <p className="dark:text-darkText-2">ID: {userId}</p>
          </div>
        </div>
        <SectionSeparator />
      </div>
      {profile_links.map((link, index) => (
        <Link
          className="py-2 px-5 sm:py-3 sm:px-[30px] text-text-primary dark:text-darkText-1 hover:bg-neutral-2 dark:hover:bg-[#3C3D37]"
          key={index}
          href={link.href}
          target={link.target || "_self"}
        >
          {link.name}
        </Link>
      ))}
      <button
        type="button"
        className="flex gap-2 py-2 px-5 sm:py-3 sm:px-[30px] text-status-error-primary hover:bg-neutral-2"
        onClick={() => {
          logout();
        }}
      >
        <LogoutIcon />
        logout
      </button>
    </>
  );
};

export default NavProfileDropdown;
