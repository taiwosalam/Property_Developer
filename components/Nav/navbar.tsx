import React from "react";
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

const Navbar = () => {
  const { isCustom } = useWindowWidth(1024);

  return (
    <div className="sticky top-0 z-[2] w-full h-[100px] px-3 sm:px-10 flex items-center border-b border-solid border-neutral-2 bg-white">
      <div className="flex w-full gap-2 lg:gap-6 justify-between">
        <div className="flex flex-1 gap-6 items-center">
          <div className="hidden md:block w-[200px] h-full rounded-lg">
            <Image src={LogoPlacholder} alt="logo" className="h-full" />
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
                <NavSwitchUserSwitch />
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
                    Mr Taiwo Salam
                  </p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownContent className="custom-flex-col gap-4 pb-[10px] min-w-[300px] sm:min-w-[350px] text-sm sm:text-base font-normal capitalize">
              <NavProfileDropdown />
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
