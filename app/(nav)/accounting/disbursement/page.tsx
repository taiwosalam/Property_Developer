"use client";

import React from "react";
import Link from "next/link";

// Images
import PdfIcon from "@/public/icons/pdf-icon.svg";
import ExcelIcon from "@/public/icons/excel-icon.svg";
import ThreeDotsVertical from "@/public/icons/three-dots-vertical.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { ExclamationMark } from "@/public/icons/icons";
import SearchInput from "@/components/SearchInput/search-input";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import NewDisbursementModal from "@/components/Accounting/Disbursement/new-disbursement-modal";

const Disbursement = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <h1 className="text-black text-2xl font-medium">Disbursement</h1>
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
        <div className="page-title-container">
          <div></div>
          <div className="flex items-center gap-4">
            <SearchInput placeholder="Search for Staff and Branch" />
            <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
              <button>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Picture src="/icons/sliders.svg" alt="filters" size={20} />
                  <p className="text-[#344054] text-base font-medium">
                    Filters
                  </p>
                </div>
              </button>
            </div>
            <Link
              href={"/accounting/disbursement/export"}
              className="flex items-center gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
            >
              <Picture src={PdfIcon} alt="pdf icon" size={20} />
              <p className="text-[#344054] text-base font-medium">Export</p>
            </Link>
            <Link
              href={"/accounting/disbursement/export"}
              className="flex items-center gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
            >
              <Picture src={ExcelIcon} alt="excel icon" size={20} />
              <p className="text-[#344054] text-base font-medium">Export</p>
            </Link>
          </div>
        </div>
        <div className="rounded-lg w-full pb-[120px] overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
              <col span={6} />
              <col className="w-[62px]" />
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
                    <td>
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
                    <td>
                      <Dropdown>
                        <DropdownTrigger className="flex items-center justify-center">
                          <Picture
                            src={ThreeDotsVertical}
                            alt="three dots vertical"
                            size={24}
                          />
                        </DropdownTrigger>
                        <DropdownContent>
                          <div className="w-[250px] bg-white custom-flex-col py-2 gap-2 text-text-secondary text-base font-bold capitalize text-center">
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
