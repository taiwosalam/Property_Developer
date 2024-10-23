"use client";

import React from "react";
import Link from "next/link";

// Images
import ThreeDotsVertical from "@/public/icons/three-dots-vertical.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { ExclamationMark } from "@/public/icons/icons";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import NewDisbursementModal from "@/components/Accounting/Disbursement/new-disbursement-modal";
import { accountingDisbursementOptionsWithDropdown } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Disbursement = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <h1 className="text-black dark:text-white text-2xl font-medium">
            Disbursement
          </h1>
          <ExclamationMark />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + new disbursement
            </Button>
          </ModalTrigger>
          <ModalContent>
            <NewDisbursementModal />
          </ModalContent>
        </Modal>
      </div>
      <div className="custom-flex-col gap-4">
        <FilterBar
          azFilter
          onStateSelect={() => {}}
          searchInputPlaceholder="Search for disbursement"
          handleFilterApply={() => {}}
          isDateTrue
          filterOptions={[]}
          filterWithOptionsWithDropdown={
            accountingDisbursementOptionsWithDropdown
          }
          hasGridListToggle={false}
          exports
          exportHref="/accounting/disbursement/export"
        />

        <div className="rounded-lg w-full pb-[120px] overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="min-w-[72px]" />
              <col span={6} />
              <col className="min-w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>date</th>
                <th>landlord / landlady</th>
                <th>payment ID</th>
                <th>amount</th>
                <th>description</th>
                <th>mode</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="flex items-center justify-center">
                      <Picture
                        src={Avatar}
                        alt="profile picture"
                        size={40}
                        rounded
                      />
                    </td>
                    <td>
                      <p>02/03/2024</p>
                    </td>
                    <td>
                      <p>Amori Ademakinwa</p>
                    </td>
                    <td>
                      <p>1234567878</p>
                    </td>
                    <td>
                      <p>₦115,000.00</p>
                    </td>
                    <td>
                      <p>Property Rent for moniya house</p>
                    </td>
                    <td>
                      <p>Bank Transfer</p>
                    </td>
                    <td className="flex items-center justify-center">
                      <Dropdown>
                        <DropdownTrigger className="flex items-center justify-center">
                          <Picture
                            src={ThreeDotsVertical}
                            alt="three dots vertical"
                            size={24}
                          />
                        </DropdownTrigger>
                        <DropdownContent>
                          <div className="w-[250px] bg-white dark:bg-darkText-primary custom-flex-col py-2 gap-2 text-text-secondary dark:text-darkText-1 text-base font-bold capitalize text-center">
                            <Link
                              href={
                                "/accounting/disbursement/1/manage-disbursement"
                              }
                              className="p-4"
                            >
                              Manage Disbursement
                            </Link>
                            <Link
                              href={
                                "/accounting/disbursement/1/preview-disbursement"
                              }
                              className="p-4"
                            >
                              Preview Disbursement
                            </Link>
                          </div>
                        </DropdownContent>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Disbursement;
