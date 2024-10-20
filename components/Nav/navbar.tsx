import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Images
import Mail from "@/public/icons/mail.svg";
import Bell from "@/public/icons/bell.svg";
import Moon from "@/public/icons/moon.svg";
import Search from "@/public/icons/search-icon.svg";
import PlusBold from "@/public/icons/plus-bold.svg";  
import DropdownList from "@/public/icons/dropdown-list.svg";
import SearchIconBold from "@/public/icons/search-icon-bold.svg";
import Sun from "@/public/icons/sun.svg";
import DarkIcon from "@/public/icons/dark-icon.svg";

import Avatar from "@/public/empty/avatar.png";
import LogoPlacholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { useTheme } from "next-themes"

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import clsx from "clsx";
import { empty } from "@/app/config";
import { getGreeting } from "./data";
import NavCreateNew from "./nav-create-new";
import { useAuthStore } from "@/store/authstrore";
import NavGlobalSearch from "./nav-global-search";
import useWindowWidth from "@/hooks/useWindowWidth";
import { NavIcon } from "@/components/Nav/nav-components";
import NavSwitchUserSwitch from "./nav-switch-user-switch";
import { getDashboardData } from "@/app/(nav)/dashboard/data";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import NavProfileDropdown from "@/components/Nav/nav-profile-dropdown";

interface UserData {
  user_id: number;
  email: string;
  stage: number;
  role: string;
  company_name: string;
  company_type: string;
  company_industry: string | null;
  cac_certificate: string;
  membership_certificate: string;
  cac_date: string;
  company_phone: string;
  logo: string;
  profile_pic: string;
  director_name: string;
  director_title: string;
  director_experience: string;
  director_email: string;
  director_about: string;
  director_phone: string;
  verification: string;
}

const Navbar = () => {
  const { isCustom } = useWindowWidth(1024);

  const [loading, setLoading] = useState(true);

  const { theme, setTheme } = useTheme()

  const [themeIcon, setThemeIcon] = useState(Moon); 

  const toggleTheme = () => {
    console.log(theme); 
    switch (theme) { 
      case "light":
        setTheme("dark");
        setThemeIcon(DarkIcon);
        break;
      case "dark":
        setTheme("light");
        setThemeIcon(Sun); 
        break;
      default: 
        setTheme("light"); 
        setThemeIcon(Sun); 
        break;
    }
  };

  const [dashboardData, setDashboardData] = useState<UserData>({
    user_id: 0,
    email: "",
    stage: 0,
    role: "",
    company_name: "",
    company_type: "",
    company_industry: null,
    cac_certificate: "",
    membership_certificate: "",
    cac_date: "",
    company_phone: "",
    logo: "",
    profile_pic: "",
    director_name: "",
    director_title: "",
    director_experience: "",
    director_email: "",
    director_about: "",
    director_phone: "",
    verification: "",
  });

  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(accessToken);

        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div
      className={clsx(
        "sticky top-0 z-[2] w-full h-[100px] px-3 sm:px-10 flex items-center border-b border-solid border-neutral-2 dark:border-[#292929] bg-white dark:bg-[#020617]",
        {
          skeleton: loading,
        }
      )}
    >
      <div className="flex w-full gap-2 lg:gap-6 justify-between">
        <div className="flex flex-1 gap-6 items-center">
          <div
            className={clsx(
              "hidden md:block w-[200px] h-full rounded-lg relative",
              {
                "skeleton-elem": loading,
              }
            )}
          >
            <Image
              src={dashboardData.logo || empty}
              alt="logo"
              fill
              priority
              sizes="auto"
              className="h-full object-cover"
            />
          </div>
          <div className="flex flex-1 gap-2">
            {isCustom ? (
              <>
                <NavIcon src={DropdownList} alt="dropdown list" />
                <NavIcon src={SearchIconBold} alt="search" />
                <NavIcon src={PlusBold} alt="create new" />
              </>
            ) : (
              <>
                <NavSwitchUserSwitch userType={dashboardData.company_type} />
                <Modal>
                  <ModalTrigger className="p-4 flex-1 max-w-[240px] flex items-center gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]">
                    <span className="text-brand-9">
                    <Picture src={Search} alt="search" size={24} />
                    </span>
                    <p className="text-[#0a132ea6] dark:text-white text-base font-semibold">
                      Search
                    </p>
                  </ModalTrigger>
                  <ModalContent>
                    <NavGlobalSearch />
                  </ModalContent>
                </Modal>
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      size="base_medium"
                      className="py-[10px] px-5 rounded-lg"
                    >
                      + Create New
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <NavCreateNew />
                  </ModalContent>
                </Modal>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isCustom ? (
            <div className="flex gap-2">
              <NavIcon src={Mail} alt="messages" href="/messages" />
              <NavIcon src={Bell} alt="notifications" href="/notifications" />
              <NavIcon src={Moon} alt="theme" />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href={"/messages"}>
                <Picture src={Mail} alt="messages" size={32} />
              </Link>
              <Link href={"/notifications"}>
                <Picture src={Bell} alt="notifications" size={32} />
              </Link>
              <button onClick={toggleTheme}>
                <Picture src={themeIcon} alt="theme" size={32} />
              </button>
            </div>
          )}
          <Dropdown className="flex items-center">
            <DropdownTrigger>
              <div className="flex items-center gap-4">
                <Picture
                  src={Avatar}
                  alt="profile picture"
                  size={isCustom ? 45 : 60}
                  status
                />
                <div className="hidden sm:flex flex-col text-text-secondary capitalize">
                  <p className="text-[10px] md:text-xs font-normal dark:text-[#F1F1D9]">
                    {getGreeting()},
                  </p>
                  <p className="text-xs md:text-base font-medium dark:text-white">
                    {dashboardData.director_name}
                  </p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownContent className="custom-flex-col gap-2 pb-[10px] min-w-[300px] sm:min-w-[350px] text-sm sm:text-base font-normal capitalize">
              <NavProfileDropdown
                name={dashboardData.director_name}
                userId={dashboardData.user_id}
              />
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
