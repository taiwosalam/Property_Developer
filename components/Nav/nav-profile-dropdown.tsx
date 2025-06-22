import Link from "next/link";

import Avatar from "@/public/empty/avatar.png";

// Imports
import { getGreeting, truncateName } from "./data";
import Picture from "../Picture/picture";
import { LogoutIcon } from "@/public/icons/icons";
import useWindowWidth from "@/hooks/useWindowWidth";
import { getProfileDropdownItems, logout } from "@/app/(onboarding)/auth/data";
import { profile_actions } from "@/components/Nav/options";
import { SectionSeparator } from "../Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { useState } from "react";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";

const NavProfileDropdown = () => {
  const router = useRouter();
  const { role, setRole } = useRole();
  const { isMobile } = useWindowWidth();
  const name = usePersonalInfoStore((state) => state.name);
  const userId = usePersonalInfoStore((state) => state.user_id);
  const profile_picture = usePersonalInfoStore(
    (state) => state.profile_picture
  );
  const [requestLoading, setRequestLoading] = useState(false);

  const actions = getProfileDropdownItems(role) || "";

  const class_styles =
    "py-2 px-5 sm:py-3 sm:px-[30px] text-start text-text-primary dark:text-darkText-1 hover:bg-neutral-2 dark:hover:bg-[#3C3D37]";

  const handleLogout = async () => {
    setRequestLoading(true);
    const status = await logout();
    if (status) {
      if (role === "director") {
        router.push("/auth/sign-in");
      } else {
        router.push("/auth/user/sign-in");
      }
    }
    setRequestLoading(false);
  };

  return (
    <>
      <div className="custom-flex-col hover:bg-gray-200 dark:hover:bg-[#3c3d37]">
        <Link href={"/settings/security"} className="flex items-center gap-4 p-4">
          <Picture
            src={profile_picture || Avatar}
            alt="profile picture"
            size={isMobile ? 50 : 60}
            status
            containerClassName="bg-[var(--secondary-color)] rounded-full"
            rounded
          />
          <div className="custom-flex-col text-text-secondary font-medium">
            <p className="text-xs font-normal dark:text-darkText-2">
              {getGreeting()}
            </p>
            <p className="dark:text-white">{truncateName(name, 50)}</p>
            <p className="dark:text-darkText-2">ID: {userId}</p>
          </div>
        </Link>
        <SectionSeparator />
      </div>
      {actions &&
        actions?.map(({ label, link, modal }, index) =>
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
            <Modal key={index}>
              <ModalTrigger className={class_styles}>{label}</ModalTrigger>
              <ModalContent>{modal}</ModalContent>
            </Modal>
          ) : null
        )}
      <button
        type="button"
        className="flex gap-2 py-2 px-5 sm:py-3 sm:px-[30px] text-status-error-primary hover:bg-neutral-2"
        onClick={handleLogout}
        disabled={requestLoading}
      >
        <LogoutIcon />
        {requestLoading ? "logging out..." : "logout"}
      </button>
    </>
  );
};

export default NavProfileDropdown;
