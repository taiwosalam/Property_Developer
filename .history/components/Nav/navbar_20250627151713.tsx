"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { empty } from "@/app/config";
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
import { getGreeting, truncateName } from "./data";
import NavCreateNew from "./nav-create-new";
import NavGlobalSearch from "./nav-global-search";
import { NavIcon, NotificationBadge } from "@/components/Nav/nav-components";
import NavSwitchUserSwitch from "./nav-switch-user-switch";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import NavProfileDropdown from "@/components/Nav/nav-profile-dropdown";
import { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DrawerComponent } from "../BadgeIcon/create-tenancy-aggrement-modal";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import { ProfileResponse } from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { applyFont } from "@/app/(onboarding)/auth/data";
import { roundUptoNine } from "@/app/(nav)/(messages-reviews)/messages/data";
import {
  clearAllNotification,
  NotificationApiResponse,
  transformNotificationData,
} from "@/app/(nav)/notifications/data";
import { usePathname } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { saveCompanyStatusToCookie } from "@/utils/saveRole";
import { pageSteps } from "@/tour/steps/page-steps";

const Header = () => {
  const { isMobile } = useWindowWidth();
  const hasMounted = useRef(false);
  const isManualToggle = useRef(false);
  const setColor = useThemeStoreSelectors.getState().setColor;
  const { theme, setTheme } = useTheme();
  const [mobileToggleOpen, setMobileToggleOpen] = useState(false);

  const pathname = usePathname();

  const { company_id } = usePersonalInfoStore();
  const unreadMessageCount =
    usePersonalInfoStore((state) => state.unread_messages_count) || 0;
  const notificationCount =
    usePersonalInfoStore((state) => state.unread_notifications_count) || 0;
  const loggedInUserDetails = getLocalStorage("additional_details");
  const { company: loggedUserCompany, appearance } = loggedInUserDetails || {};
  const setPersonalInfo = usePersonalInfoStore(
    (state) => state.setPersonalInfo
  );
  const name = usePersonalInfoStore((state) => state.name);
  const user_online_status = usePersonalInfoStore(
    (state) => state.user_online_status
  );
  const profile_picture = usePersonalInfoStore(
    (state) => state.profile_picture
  );
  const company_logo = usePersonalInfoStore((state) =>
    theme === "light"
      ? getLocalStorage("light_logo")
      : getLocalStorage("dark_logo")
      ? getLocalStorage("dark_logo")
      : getLocalStorage("light_logo")
  );

  const { data, loading, refetch } = useFetch<ProfileResponse>("/user/profile");
  useRefetchOnEvent("fetch-profile", () => refetch({ silent: true }));

  const { data: companyData, refetch: companyRefetch } = useFetch<any>(
    company_id ? `companies/${company_id}` : null
  );
  useRefetchOnEvent("refetchProfile", () => companyRefetch({ silent: true }));

  /* NOTIFICATION LOGIC*/
  const [notificationIds, setNotificationIds] = useState<string[]>([]);
  const [notificationCounts, setNotificationCount] = useState(0);
  const {
    data: apiData,
    silentLoading,
    error,
    refetch: refetchNotifications,
  } = useFetch<NotificationApiResponse>(`/notifications`);

  useEffect(() => {
    if (apiData) {
      const ids = apiData?.data?.length
        ? apiData?.data?.map((item) => item.id)
        : [];
      setNotificationIds(ids);

      const unreadCount = apiData?.data.filter(
        (notification) => !notification.read_at
      ).length;
      setNotificationCount(unreadCount);

      saveLocalStorage("notificationCount", unreadCount);
    }
  }, [apiData]);

  const handleClearNotifications = async () => {
    if (!notificationIds.length) return;

    try {
      const res = await clearAllNotification(notificationIds);

      if (res) {
        setNotificationCount(0);

        if (pathname === "/notifications") {
          saveLocalStorage("notificationCount", 0);
        }
        //refetchNotifications()
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (companyData?.data) {
      setPersonalInfo("dark_logo", companyData.data.dark_logo);
      saveLocalStorage("dark_logo", companyData?.data?.dark_logo);
      saveLocalStorage("light_logo", companyData?.data?.company_logo);
    }
  }, [companyData, setPersonalInfo]);

  useEffect(() => {
    if (appearance && !hasMounted.current) {
      const { colorMode, navbar, fonts, dashboardColor } = appearance;
      saveLocalStorage("navbar", navbar);
      setColor(dashboardColor);
      applyFont(fonts);
      setTheme(colorMode);
      hasMounted.current = true;
    }
  }, [appearance, setColor, setTheme]);

  useEffect(() => {
    if (data?.data) {
      const {
        user,
        currentPlan,
        isSubscriptionExpired,
        company,
        profile,
        requestDemos,
        director,
        company_wallet,
        currentExpiryDate,
      } = data.data;

      setPersonalInfo("user_id", user.userid);
      setPersonalInfo("userId", user.id);
      setPersonalInfo(
        "name",
        `${profile?.title ? profile.title + " " : ""}${user.name}`
      );
      setPersonalInfo("director_id", director?.id ? director?.id : null);
      setPersonalInfo("full_name", user.name);
      setPersonalInfo("user_email", user.email);
      setPersonalInfo("user_online_status", user.user_online_status);
      setPersonalInfo(
        "unread_notifications_count",
        user.unread_notifications_count
      );
      setPersonalInfo("unread_messages_count", user.unread_messages_count);
      setPersonalInfo("title", profile?.title as string);
      setPersonalInfo("profile_picture", director?.picture || profile.picture);
      if (company) {
        setPersonalInfo("company_id", company.company_id);
        setPersonalInfo("company_logo", company.company_logo);
        setPersonalInfo("company_name", company.company_name);
        setPersonalInfo("company_state", company.state);
        setPersonalInfo("company_status", company.company_status);
        saveCompanyStatusToCookie(company.company_status); //INCASE LOGIN RESPONSE RETURNS INCORRECT COMPANY STATUS
        setPersonalInfo("reject_reason", company.reject_reason);
        setPersonalInfo("company_local_government", company.local_government);
        setPersonalInfo(
          "company_head_office_address",
          company.head_office_address
        );
        setPersonalInfo("company_city", company.city);
        setPersonalInfo("company_phone_number", company.phone_numbers);
        setPersonalInfo("date_of_registration", company.date_of_registration);
        setPersonalInfo("membership_number", company.membership_number);
        setPersonalInfo("is_verified", company.is_verified);
        setPersonalInfo("is_owner", user.is_owner);
        setPersonalInfo("industry", company.industry);
        setPersonalInfo("company_wallet", company_wallet);
        setPersonalInfo("isSubscriptionExpired", isSubscriptionExpired);
        setPersonalInfo("currentPlan", currentPlan);
        setPersonalInfo("currentExpiryDate", currentExpiryDate);
        setPersonalInfo(
          "cac_registration_number",
          company.cac_registration_number
        );
      }
      setPersonalInfo(
        "requestDemo",
        Array.isArray(requestDemos) && requestDemos.length > 0
      );
    }
  }, [data, setPersonalInfo]);

  const toggleTheme = () => {
    if (!hasMounted.current) return;
    const primaryColor = getLocalStorage("primary-color");
    if (primaryColor === "#000000") {
      toast.error("Cannot use dark mode on the selected primary color");
      setTheme("light");
      return;
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isOnline = useOnlineStatus();

  const lgIconsInteractionClasses =
    "flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-neutral-2 dark:hover:bg-[#707165]";

  // Animation variants for slide effect
  const slideVariants: Variants = {
    logo: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    profile: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    logoExit: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    profileExit: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-[4] w-full h-[100px] px-3 md:px-10 py-[12.5px] flex gap-4 md:gap-7 lg:gap-5 items-center border-b border-neutral-2 dark:border-[#292929] bg-white dark:bg-[#020617] flex-row-reverse md:flex-row",
        loading && "skeleton"
      )}
    >
      <div className="flex-1 h-full flex gap-6 items-center">
        {/* Logo - Desktop Only */}
        <div className="hidden md:block w-[200px] h-full rounded-lg relative overflow-hidden">
          {loading ? (
            <Skeleton
              width="100%"
              height="100%"
              animation="wave"
              sx={{ transform: "none" }}
            />
          ) : (
            <Image
              src={company_logo || empty}
              alt="company logo"
              fill
              priority
              sizes="auto"
              className="object-contain"
            />
          )}
        </div>

        {/* Mobile & Tablet Icons */}
        <div className="lg:hidden flex items-center gap-2 md:justify-between md:flex-1 ml-auto md:ml-0">
          {/* Tablet Icons */}
          <div className="hidden md:flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <NavIcon
                icon={<DropdownListIcon size={21} />}
                alt="dropdown list"
              />
              <Modal>
                <ModalTrigger>
                  <NavIcon icon={<SearchIconBold size={21} />} alt="search" />
                </ModalTrigger>
                <ModalContent>
                  <NavGlobalSearch />
                </ModalContent>
              </Modal>
              <Modal>
                <ModalTrigger>
                  <NavIcon icon={<PlusBoldIcon size={21} />} alt="create new" />
                </ModalTrigger>
                <ModalContent>
                  <NavCreateNew />
                </ModalContent>
              </Modal>
            </div>
            <div className="flex items-center gap-2">
              <NavIcon
                icon={<MailIcon size={21} />}
                href="/messages"
                alt="messages"
                count={unreadMessageCount}
                badgeColor="red"
              />
              <NavIcon
                icon={<BellIcon size={21} />}
                count={notificationCounts}
                alt="notifications"
                href="/notifications"
              />
            </div>
          </div>

          {/* Mobile Toggle */}
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
                  {/* <NavIcon
                    icon={<DropdownListIcon size={21} />}
                    alt="dropdown list"
                  /> */}
                      <div ref={containerRef} className="relative flex-1 max-w-[240px]">
      {trigger ? (
        <div onClick={handleSwitch}>{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={handleSwitch}
          aria-label="switch user"
          className="w-full h-full px-4 py-[12px] flex items-center justify-between gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]"
        >
          <span className="text-[#0a132ea6] dark:text-white text-base font-semibold capitalize custom-truncated">
            Property Manager
          </span>
          <ChevronDown size={20} color={isDarkMode ? "#fff" : "#0a132ea6"} />
        </button>
      )}
                  <Modal>
                    <ModalTrigger>
                      <NavIcon
                        icon={<SearchIconBold size={21} />}
                        alt="search"
                      />
                    </ModalTrigger>
                    <ModalContent>
                      <NavGlobalSearch />
                    </ModalContent>
                  </Modal>
                  <Modal>
                    <ModalTrigger>
                      <NavIcon
                        icon={<PlusBoldIcon size={21} />}
                        alt="create new"
                      />
                    </ModalTrigger>
                    <ModalContent>
                      <NavCreateNew />
                    </ModalContent>
                  </Modal>
                  <NavIcon
                    href="/messages"
                    icon={<MailIcon size={21} />}
                    alt="messages"
                    count={unreadMessageCount}
                    badgeColor="red"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <NavIcon
                    icon={<MailIcon size={21} />}
                    href="/messages"
                    badgeColor="red"
                    alt="messages"
                    count={unreadMessageCount}
                  />
                  <NavIcon
                    icon={<BellIcon size={21} />}
                    count={notificationCounts}
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex-1 lg:flex lg:justify-between lg:items-center lg:gap-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="module-dropdown">
              <NavSwitchUserSwitch />
            </div>
            <Modal>
              <ModalTrigger className="nav-global-search px-4 py-[12px] flex-1 max-w-[240px] flex items-center gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]">
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
                  className="nav-create-new py-[10px] px-5 rounded-lg flex-1 max-w-fit"
                >
                  <span className="line-clamp-1 text-ellipsis">
                    + Create New
                  </span>
                </Button>
              </ModalTrigger>
              <ModalContent>
                <NavCreateNew />
              </ModalContent>
            </Modal>
            <DrawerComponent />
          </div>

          <div className="flex gap-4 items-center text-[#5A5D61] dark:text-white">
            <div className="relative">
              <Link
                href="/messages"
                aria-label="messages"
                className={`nav-messages ${lgIconsInteractionClasses}`}
              >
                <MailIcon />
                <NotificationBadge
                  count={roundUptoNine(unreadMessageCount)}
                  color="red"
                />
              </Link>
            </div>
            <div className="relative" onClick={handleClearNotifications}>
              <Link
                href="/notifications"
                aria-label="notifications"
                className={`nav-notifications ${lgIconsInteractionClasses}`}
              >
                <BellIcon />
                <NotificationBadge
                  count={roundUptoNine(notificationCounts)}
                  color="green"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile: Company Logo / Profile Dropdown with Slide Animation */}
      <div className="md:hidden w-[300px] h-full relative">
        <AnimatePresence mode="wait">
          {mobileToggleOpen ? (
            <motion.div
              key="profile"
              variants={slideVariants}
              initial="profileExit"
              animate="profile"
              exit="profileExit"
              className="w-full h-full absolute top-0 left-0"
            >
              {/* Dropdown is outside of any overflow:hidden */}
              <Dropdown className="profile-dropdown w-full h-full">
                <DropdownTrigger>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#020617] h-full">
                    <Picture
                      src={profile_picture || empty}
                      alt="profile picture"
                      status={isOnline}
                      size={50}
                      rounded
                      containerClassName="flex-shrink-0 bg-[var(--secondary-color)] rounded-full"
                    />
                    <div className="flex flex-col text-text-secondary capitalize overflow-hidden">
                      <p className="text-[10px] font-normal dark:text-[#F1F1D9] whitespace-nowrap">
                        {getGreeting()},
                      </p>
                      <p className="text-xs font-medium dark:text-white capitalize truncate">
                        {truncateName(name ? name.toLowerCase() : "", 30)}
                      </p>
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownContent
                  direction="down"
                  position="left"
                  className="custom-flex-col gap-2 pb-[10px] min-w-[200px] text-sm font-normal capitalize z-50"
                >
                  <NavProfileDropdown />
                </DropdownContent>
              </Dropdown>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              variants={slideVariants}
              initial="logoExit"
              animate="logo"
              exit="logoExit"
              className="w-full h-full absolute top-0 left-0"
            >
              {loading ? (
                <Skeleton
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ transform: "none" }}
                />
              ) : (
                <Image
                  src={company_logo || empty}
                  alt="company logo"
                  width={200}
                  height={200}
                  priority
                  className="object-contain w-full h-full"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Desktop: Profile Dropdown */}
      <div className="hidden md:block">
        <Dropdown className="profile-dropdown">
          <DropdownTrigger>
            <div className="flex items-center gap-4">
              <Picture
                src={profile_picture || empty}
                alt="profile picture"
                status={isOnline}
                size={isMobile ? 50 : 60}
                rounded
                containerClassName="flex-shrink-0 bg-[var(--secondary-color)] rounded-full"
              />
              <div className="flex flex-col text-text-secondary capitalize">
                <p className="text-[10px] md:text-xs font-normal dark:text-[#F1F1D9]">
                  {getGreeting()},
                </p>
                <p className="text-xs md:text-base font-medium dark:text-white capitalize">
                  {truncateName(name ? name.toLowerCase() : "", 50)}
                </p>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownContent
            direction="down"
            position="right"
            className="custom-flex-col gap-2 pb-[10px] min-w-[300px] sm:min-w-[350px] text-sm sm:text-base font-normal capitalize z-20"
          >
            <NavProfileDropdown />
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
