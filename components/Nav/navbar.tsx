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

// Imoprts
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import useWindowWidth from "@/hooks/useWindowWidth";
import { NavIcon } from "@/components/Nav/nav-components";
import NavProfileDropdown from "@/components/Nav/nav-profile-dropdown";

const Navbar = () => {
  const { isCustom } = useWindowWidth(1024);

  return (
    <div className="sticky top-0 z-[2] w-full h-[100px] px-3 sm:px-10 flex items-center border-b border-solid border-neutral-2 bg-white">
      <div className="flex w-full gap-2 lg:gap-6 justify-between">
        <div className="flex flex-1 gap-6 items-center">
          <div className="hidden md:block w-[200px] h-full bg-brand-3 rounded-lg"></div>
          <div className="flex flex-1 gap-2">
            {isCustom ? (
              <>
                <NavIcon src={DropdownList} alt="dropdown list" />
                <NavIcon src={SearchIconBold} alt="search" />
                <NavIcon src={PlusBold} alt="create new" />
              </>
            ) : (
              <>
                <Input
                  id="date"
                  placeholder="--- ---"
                  className="flex-1 max-w-[240px] font-semibold"
                  style={{ backgroundColor: "#F1F1F1", border: "none" }}
                />
                <Input
                  id="search"
                  leftIcon={Search}
                  placeholder="Search"
                  className="flex-1 max-w-[240px] font-semibold"
                  style={{ backgroundColor: "#F1F1F1", border: "none" }}
                />
                <Button size="mid">+ Create New</Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isCustom ? (
            <div className="flex gap-2">
              <NavIcon src={Mail} alt="messages" href="/messages" />
              <NavIcon src={Bell} alt="notifications" href="/notifications" />
              <NavIcon src={Moon} alt="create new" />
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
                <div className="custom-flex-col text-text-secondary capitalize">
                  <p className="text-[10px] md:text-xs font-normal">
                    Good Morning,
                  </p>
                  <p className="text-xs md:text-base font-medium">
                    Mr Taiwo Salam
                  </p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownContent className="custom-flex-col gap-4 pb-[10px] min-w-[350px] text-base font-normal capitalize">
              <NavProfileDropdown />
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
