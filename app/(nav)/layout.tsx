"use client";

import Image from "next/image";
import React, { useState } from "react";

// Images
import Mail from "@/public/icons/mail.svg";
import Bell from "@/public/icons/bell.svg";
import Moon from "@/public/icons/moon.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import SVG from "@/components/SVG/svg";
import { Color } from "@/types/global";
import Sidenav from "@/components/Nav/sidenav";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useThemeStoreSelectors } from "@/store/themeStore";

const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sidenav_width = 250;

  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  const [sidenavIsOpen, setSidenavIsOpen] = useState(true);

  return (
    <>
      <div className="sticky top-0 z-[2] w-full h-[100px] px-10 flex items-center border-b border-solid border-neutral-2 bg-white">
        <div className="flex w-full gap-6 justify-between">
          <div className="flex flex-1 gap-6 items-center">
            <div className="w-[200px] h-full bg-brand-3 rounded-lg"></div>
            <div className="flex flex-1 gap-2">
              <Input
                id="date"
                placeholder="--- ---"
                className="flex-1 max-w-[200px]"
              />
              <Input
                id="search"
                placeholder="Search"
                className="flex-1 max-w-[200px]"
              />
              <Button size="mid">+ Create New</Button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Image
                src={Mail}
                alt="messages"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <Image
                src={Bell}
                alt="notifications"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <Image
                src={Moon}
                alt="theme"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={Avatar}
                  alt="profile picture"
                  width={100}
                  height={100}
                  className="w-[60px] h-[60px] rounded-full"
                />
                <div className="w-4 h-4 rounded-full bg-status-success-primary absolute bottom-0 right-0"></div>
              </div>
              <div className="custom-flex-col text-text-secondary capitalize">
                <p className="text-xs font-normal">Good Morning,</p>
                <p className="text-base font-medium">Mr Taiwo Salam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex relative z-[1]">
        <div
          style={{
            height: "calc(100vh - 100px)",
            minWidth: sidenavIsOpen ? sidenav_width : 0,
          }}
          className="sticky top-[100px] w-0 overflow-x-hidden overflow-y-auto no-scrollbar bg-white"
        >
          <Sidenav />
        </div>
        <div className="custom-flex-col flex-1 bg-neutral-2">
          <div className="custom-flex-col sticky top-[99px] bg-white z-[2]">
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
            <div className="h-[50px] pl-3 pr-10 flex items-center justify-between bg-white ">
              <button onClick={() => setSidenavIsOpen((prev) => !prev)}>
                <SVG
                  type="sidebar"
                  color={primaryColor as Color}
                  className="w-8 h-8"
                />
              </button>
              <p className="capitalize text-text-primary text-sm font-medium">
                dashboard
              </p>
            </div>
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
          </div>
          <div className="p-6 relative z-[1]">{children}</div>
        </div>
      </div>
    </>
  );
};

export default NavLayout;
