"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Images
import Mail from "@/public/icons/mail.svg";
import Bell from "@/public/icons/bell.svg";
import Moon from "@/public/icons/moon.svg";
import Logout from "@/public/icons/logout.svg";
import Search from "@/public/icons/search-icon.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import clsx from "clsx";
import gsap from "gsap";
import SVG from "@/components/SVG/svg";
import { Color } from "@/types/global";
import Sidenav from "@/components/Nav/sidenav";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useThemeStoreSelectors } from "@/store/themeStore";
import Picture from "@/components/Picture/picture";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";
import { SectionSeparator } from "@/components/Section/section-components";
import { profile_links } from "./notifications/data";

const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const sidenav_width = 250;

  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  const [sidenavIsOpen, setSidenavIsOpen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline.to(containerRef.current, {
      width: sidenavIsOpen ? sidenav_width : 110,
      duration: 0.5,
      ease: "expo.out",
    });
  }, [sidenavIsOpen]);

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
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Link href={"/messages"}>
                <Picture src={Mail} alt="messages" size={32} />
              </Link>
              <Link href={"/notifications"}>
                <Picture src={Bell} alt="notifications" size={32} />
              </Link>
              <Picture src={Moon} alt="theme" size={32} />
            </div>
            <Dropdown className="flex items-center">
              <DropdownTrigger>
                <div className="flex items-center gap-4">
                  <Picture
                    src={Avatar}
                    alt="profile picture"
                    size={60}
                    status
                  />
                  <div className="custom-flex-col text-text-secondary capitalize">
                    <p className="text-xs font-normal">Good Morning,</p>
                    <p className="text-base font-medium">Mr Taiwo Salam</p>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownContent className="custom-flex-col gap-4 pb-[10px] min-w-[350px] text-base font-normal capitalize">
                <div className="custom-flex-col">
                  <div className="flex items-center gap-4 p-4">
                    <Picture
                      src={Avatar}
                      alt="profile picture"
                      size={60}
                      status
                    />
                    <div className="custom-flex-col text-text-secondary font-medium">
                      <p className="text-xs font-normal">Good Morning,</p>
                      <p>Mr Taiwo Salam</p>
                      <p>ID: 1234567890096</p>
                    </div>
                  </div>
                  <SectionSeparator />
                </div>
                {profile_links.map((link, index) => (
                  <Link
                    className="py-3 px-[30px] text-text-primary hover:bg-neutral-2"
                    key={index}
                    href={""}
                  >
                    {link}
                  </Link>
                ))}
                <Link
                  className="flex gap-2 py-3 px-[30px] text-status-error-primary hover:bg-neutral-2"
                  href={""}
                >
                  <Picture src={Logout} alt="logout" size={24} />
                  logout
                </Link>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="w-full flex relative z-[1]">
        <div
          ref={containerRef}
          style={{
            height: "calc(100vh - 100px)",
          }}
          className={clsx(
            "sticky top-[100px] overflow-x-hidden overflow-y-auto no-scrollbar bg-white",
            {
              "sidenav-collapsed": !sidenavIsOpen,
            }
          )}
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
                {pathname.split("/").slice(1).join(" > ")}
              </p>
            </div>
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
          </div>
          <main className="p-6 relative z-[1]">{children}</main>
        </div>
      </div>
    </>
  );
};

export default NavLayout;
