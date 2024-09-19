import React, { useEffect, useState } from "react";
import Link from "next/link";

// Images
import Mail from "@/public/icons/mail.svg";
import Bell from "@/public/icons/bell.svg";
import Moon from "@/public/icons/moon.svg";
import Search from "@/public/icons/search-icon.svg";
import PlusBold from "@/public/icons/plus-bold.svg";
import DropdownList from "@/public/icons/dropdown-list.svg";
import SearchIconBold from "@/public/icons/search-icon-bold.svg";

import Avatar from "@/public/empty/avatar.png";
import LogoPlacholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import { getGreeting } from "./data";
import NavCreateNew from "./nav-create-new";
import NavGlobalSearch from "./nav-global-search";
import useWindowWidth from "@/hooks/useWindowWidth";
import { NavIcon } from "@/components/Nav/nav-components";
import NavSwitchUserSwitch from "./nav-switch-user-switch";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import NavProfileDropdown from "@/components/Nav/nav-profile-dropdown";
import Image from "next/image";
import { useAuthStore } from "@/store/authstrore";
import { getDashboardData } from "@/app/(nav)/dashboard/data";

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
        console.log(data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className="sticky top-0 z-[2] w-full h-[100px] px-3 sm:px-10 flex items-center border-b border-solid border-neutral-2 bg-white">
      <div className="flex w-full gap-2 lg:gap-6 justify-between">
        <div className="flex flex-1 gap-6 items-center">
          <div className="hidden md:block w-[200px] h-full rounded-lg relative">
            <Image
              src={dashboardData.logo || LogoPlacholder}
              alt="logo"
              fill
              priority
              sizes="auto"
              className="h-full"
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
                  <ModalTrigger className="p-4 flex-1 max-w-[240px] flex items-center gap-2 rounded-lg bg-[#F1F1F1]">
                    <Picture src={Search} alt="search" size={24} />
                    <p className="text-[#0a132ea6] text-base font-semibold">
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
              <Picture src={Moon} alt="theme" size={32} />
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
                  <p className="text-[10px] md:text-xs font-normal">
                    {getGreeting()},
                  </p>
                  <p className="text-xs md:text-base font-medium">
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
