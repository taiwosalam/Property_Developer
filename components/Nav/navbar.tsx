import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { empty } from "@/app/config";
import Avatar from "@/public/empty/avatar.png";
import { useTheme } from "next-themes";
import useWindowWidth from "@/hooks/useWindowWidth";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";
import clsx from "clsx";
import { getGreeting } from "./data";
import NavCreateNew from "./nav-create-new";
import NavGlobalSearch from "./nav-global-search";
import { NavIcon } from "@/components/Nav/nav-components";
import NavSwitchUserSwitch from "./nav-switch-user-switch";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import NavProfileDropdown from "@/components/Nav/nav-profile-dropdown";
import { useState } from "react";
import {
  SearchIcon,
  MailIcon,
  BellIcon,
  MoonIcon,
  PlusBoldIcon,
  SearchIconBold,
  SunIcon,
  DropdownListIcon,
  SidebarIcon,
  NavCloseIcon,
} from "@/public/icons/icons";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { loading, data: dashboardData, error } = useDashboardData();
  const { isMobile } = useWindowWidth();
  const [mobileToggleOpen, setMobileToggleOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    const primaryColor = localStorage.getItem("primary-color");
    if (primaryColor === "#050901") {
      toast.error("Cannot use dark mode on the selected primary color"); // Show toast message
      setTheme("light"); // Set theme to light
      return; // Exit the function if the condition is met
    }

    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("light");
        break;
      default:
        setTheme("light");
        break;
    }
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-[4] w-full h-[100px] px-3 md:px-10 py-[12.5px] flex gap-4 md:gap-7 lg:gap-5 items-center border-b border-solid border-neutral-2 dark:border-[#292929] bg-white dark:bg-[#020617] flex-row-reverse md:flex-row",
        loading && "skeleton"
      )}
    >
      <div className="flex-1 h-full flex gap-6 items-center">
        {/* Logo */}
        <div
          className={clsx(
            "hidden md:block w-[200px] h-full rounded-lg relative overflow-hidden"
          )}
        >
          {loading ? (
            <Skeleton
              width={"100%"}
              height={"100%"}
              sx={{
                transform: "none",
              }}
            />
          ) : (
            <Image
              src={dashboardData?.logo || empty}
              alt="logo"
              fill
              priority
              sizes="auto"
              className="object-contain"
            />
          )}
        </div>

        {/*MD & Mobile Icons */}
        <div className="lg:hidden flex items-center gap-2 md:justify-between md:flex-1 ml-auto md:ml-[unset]">
          {/* MD (Tablet) Icons */}
          <div className="hidden md:flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <NavIcon
                icon={<DropdownListIcon size={21} />}
                alt="dropdown list"
              />
              <NavIcon icon={<SearchIconBold size={21} />} alt="search" />
              <NavIcon icon={<PlusBoldIcon size={21} />} alt="create new" />
            </div>
            <div className="flex items-center gap-2">
              <NavIcon
                icon={<MailIcon size={21} />}
                alt="messages"
                href="/messages"
              />
              <NavIcon
                icon={<BellIcon size={21} />}
                alt="notifications"
                href="/notifications"
              />
              <NavIcon
                icon={
                  theme === "dark" ? (
                    <SunIcon size={21} />
                  ) : (
                    <MoonIcon size={21} />
                  )
                }
                alt="theme-toggle"
                onClick={toggleTheme}
              />
            </div>
          </div>

          {/* Mobile nav toggle */}
          <div className="flex md:hidden items-center gap-2">
            <AnimatePresence mode="popLayout">
              {mobileToggleOpen ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <NavIcon
                    icon={<DropdownListIcon size={21} />}
                    alt="dropdown list"
                  />
                  <NavIcon icon={<SearchIconBold size={21} />} alt="search" />
                  <NavIcon icon={<PlusBoldIcon size={21} />} alt="create new" />
                  <NavIcon
                    icon={<MailIcon size={21} />}
                    alt="messages"
                    href="/messages"
                  />
                  <NavIcon
                    icon={
                      theme === "dark" ? (
                        <SunIcon size={21} />
                      ) : (
                        <MoonIcon size={21} />
                      )
                    }
                    alt="theme-toggle"
                    onClick={toggleTheme}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavIcon
                    icon={<BellIcon size={21} />}
                    alt="notifications"
                    href="/notifications"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <NavIcon
              icon={
                mobileToggleOpen ? <NavCloseIcon size={21} /> : <SidebarIcon />
              }
              alt="Toggle"
              onClick={() => setMobileToggleOpen(!mobileToggleOpen)}
            />
          </div>
        </div>

        {/* Nav Switch User & Other buttons for LG & above */}
        <div className="hidden lg:flex-1 lg:flex lg:justify-between lg:items-center lg:gap-4">
          <div className="flex-1 flex items-center gap-2">
            <NavSwitchUserSwitch
              loading={loading}
              error={error}
              userType={dashboardData?.company_type || ""}
            />
            <Modal>
              <ModalTrigger className="px-4 py-[12px] flex-1 max-w-[240px] flex items-center gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]">
                <SearchIcon size={24} />
                <span className="text-[#0a132ea6] dark:text-white text-base font-semibold">
                  Search
                </span>
              </ModalTrigger>
              <ModalContent>
                <NavGlobalSearch />
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <Button
                  size="base_medium"
                  className="py-[10px] px-5 rounded-lg flex-1 max-w-fit line-clamp-1 text-ellipsis"
                >
                  + Create New
                </Button>
              </ModalTrigger>
              <ModalContent>
                <NavCreateNew />
              </ModalContent>
            </Modal>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/messages" aria-label="messages">
              <MailIcon />
            </Link>
            <Link href="/notifications" aria-label="notifications">
              <BellIcon />
            </Link>
            <button
              type="button"
              aria-label="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Pic and Name */}
      <Dropdown>
        <DropdownTrigger>
          <div className="flex items-center gap-4">
            <Picture
              src={Avatar}
              alt="profile picture"
              status
              size={isMobile ? 50 : 60}
              rounded
              containerClassName="flex-shrink-0"
            />
            <div className="flex flex-col text-text-secondary capitalize">
              <p className="text-[10px] md:text-xs font-normal dark:text-[#F1F1D9]">
                {getGreeting()},
              </p>
              <p className="text-xs md:text-base font-bold dark:text-white">
                {dashboardData?.director_name}
              </p>
            </div>
          </div>
        </DropdownTrigger>
        <DropdownContent
          position={isMobile ? "left" : "right"}
          className="custom-flex-col gap-2 pb-[10px] min-w-[300px] sm:min-w-[350px] text-sm sm:text-base font-normal capitalize"
        >
          <NavProfileDropdown
            name={dashboardData?.director_name || ""}
            userId={dashboardData?.user_id || 0}
          />
        </DropdownContent>
      </Dropdown>
    </header>
  );
};

export default Header;
