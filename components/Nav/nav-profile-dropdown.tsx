import Link from "next/link";

import Avatar from "@/public/empty/avatar.png";

// Imports
import { getGreeting } from "./data";
import Picture from "../Picture/picture";
import { LogoutIcon } from "@/public/icons/icons";
import useWindowWidth from "@/hooks/useWindowWidth";
import { logout } from "@/app/(onboarding)/auth/data";
import { profile_actions } from "@/components/Nav/options";
import { SectionSeparator } from "../Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";

const NavProfileDropdown = ({
  name,
  userId,
}: {
  name: string;
  userId: number;
}) => {
  const { isMobile } = useWindowWidth();

  const class_styles =
    "py-2 px-5 sm:py-3 sm:px-[30px] text-start text-text-primary dark:text-darkText-1 hover:bg-neutral-2 dark:hover:bg-[#3C3D37]";

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
            <p className="text-xs font-normal dark:text-darkText-2">
              {getGreeting()},
            </p>
            <p className="dark:text-white">{name}</p>
            <p className="dark:text-darkText-2">ID: {userId}</p>
          </div>
        </div>
        <SectionSeparator />
      </div>
      {profile_actions.map(({ label, link, modal }, index) =>
        link ? (
          <Link
            key={index}
            href={link.href}
            className={class_styles}
            target={link.target || "_self"}
          >
            {label}
          </Link>
        ) : modal ? (
          <Modal>
            <ModalTrigger className={class_styles}>{label}</ModalTrigger>
            <ModalContent>{modal}</ModalContent>
          </Modal>
        ) : null
      )}
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
