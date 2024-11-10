"use client";

import React from "react";
import Link from "next/link";

// Images
import SendIcon from "@/public/icons/send.svg";
import BankRed from "@/public/icons/bank-red.svg";
import ReceiveIcon from "@/public/icons/receive.svg";
import SquareTopUpGreen from "@/public/icons/square-top-up-green.svg";

// Imports
import Picture from "@/components/Picture/picture";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";

const TransactionHistory = () => {
  return (
    <div className="custom-flex-col gap-16">
      <BackButton>Transaction History</BackButton>
      <FilterBar
        pageTitle="Transaction History"
        hasGridListToggle={false}
        handleFilterApply={() => {}}
        hiddenSearchInput
        exports
      />

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
    </div>
  );
};

export default TransactionHistory;
