"use client";

import React from "react";
import Link from "next/link";

// Images
import SendIcon from "@/public/icons/send.svg";
import PdfIcon from "@/public/icons/pdf-icon.svg";
import BankRed from "@/public/icons/bank-red.svg";
import ReceiveIcon from "@/public/icons/receive.svg";
import ExcelIcon from "@/public/icons/excel-icon.svg";
import SquareTopUpGreen from "@/public/icons/square-top-up-green.svg";

// Imports
import Picture from "@/components/Picture/picture";
import BackButton from "@/components/BackButton/back-button";
import Pagination from "@/components/Pagination/pagination";
import { FilterIcons } from "@/public/icons/icons";

const TransactionHistory = () => {
  return (
    <div className="custom-flex-col gap-16">
      <div className="page-title-container">
        <BackButton>Transaction History</BackButton>
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-darkText-primary rounded-lg p-2 flex items-center space-x-2">
            <button>
              <div className="flex items-center gap-2 cursor-pointer">
                {/* <Picture src="/icons/sliders.svg" alt="filters" size={20} /> */}
                <FilterIcons />
                <p className="text-[#344054] dark:text-white text-base font-medium">
                  Filters
                </p>
              </div>
            </button>
          </div>
          <Link
            href={"/wallet/audit-trail/export"}
            className="flex items-center dark:bg-darkText-primary gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
          >
            <Picture src={PdfIcon} alt="pdf icon" size={20} />
            <p className="text-[#344054] dark:text-white text-base font-medium">
              Export
            </p>
          </Link>
          <Link
            href={"/wallet/audit-trail/export"}
            className="flex items-center dark:bg-darkText-primary gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
          >
            <Picture src={ExcelIcon} alt="excel icon" size={20} />
            <p className="text-[#344054] dark:text-white text-base font-medium">
              Export
            </p>
          </Link>
        </div>
      </div>
      <div className="custom-flex-col gap-10">
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>transaction ID</th>
                <th>source</th>
                <th>description</th>
                <th>amount</th>
                <th>status</th>
                <th>date</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-status-error-1">
                        <Picture
                          src={
                            index === 0
                              ? SendIcon
                              : index === 1
                              ? ReceiveIcon
                              : index === 2
                              ? BankRed
                              : SquareTopUpGreen
                          }
                          alt="send icon"
                          size={20}
                        />
                      </div>
                    </td>
                    <td>
                      <p>00001102332</p>
                    </td>
                    <td>
                      <p>Debit</p>
                    </td>
                    <td>
                      <p>Paid for services</p>
                    </td>
                    <td>
                      <p className="text-status-error-2">-₦5,000.00</p>
                    </td>
                    <td>
                      <p>Pending</p>
                    </td>
                    <td>
                      <p>12/01/2024</p>
                    </td>
                    <td>
                      <p>03:30pm</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
      </div>
    </div>
  );
};

export default TransactionHistory;
