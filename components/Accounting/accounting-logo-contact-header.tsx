import React from "react";

// Images
import { LocationIcon } from "@/public/icons/icons";

// Imports
import Picture from "../Picture/picture";

const AccountingLogoContactHeader = () => {
  return (
    <div
      className="p-7 rounded-lg bg-white flex justify-between items-center"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div
        className="rounded-lg"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 4px 6px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <Picture src={"/empty/logo placeholder.svg"} width={300} height={100} />
      </div>
      <div className="w-fit text-left custom-flex-col gap-2">
        <p className="text-text-secondary text-sm font-medium">Contacts</p>
        <div className="text-text-secondary text-sm font-normal custom-flex-col gap-2">
          <div className="flex items-center gap-1">
            <LocationIcon color="#0033C4" />
            <span>States and Local Govt.</span>
          </div>
          <div className="flex items-center gap-1">
            <Picture src={"/icons/global-search.svg"} size={16} />
            <span>https://www.hprealestate.co.in1</span>
          </div>
          <div className="flex items-center gap-1">
            <Picture src={"/icons/phone.svg"} size={16} />
            <span>08132086958 || 09123435487 || 9848848488</span>
          </div>
          <div className="flex items-center gap-1">
            <Picture src={"/icons/mail2.svg"} size={16} />
            <span>Email@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingLogoContactHeader;
