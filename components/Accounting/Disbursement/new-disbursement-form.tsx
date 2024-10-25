import React from "react";

// Types
import type { NewDisbursementFormProps } from "./types";

// Images
import Cancel from "@/public/icons/cancel.svg";

// Imports
import Label from "@/components/Form/Label/label";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import TextArea from "@/components/Form/TextArea/textarea";
import { NavCloseIcon } from "@/public/icons/icons";

const NewDisbursementForm: React.FC<NewDisbursementFormProps> = ({
  nextStep,
  isDarkMode,
}) => {
  return (
    <div
      className="w-[600px] pb-[26px] rounded-lg bg-white dark:bg-darkText-primary custom-flex-col gap-[14px] overflow-hidden"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-[2px] p-4 bg-brand-1 dark:bg-[#3c3d37]">
        <div className="flex justify-end">
          <ModalTrigger close>
            {/* <Picture src={Cancel} alt="close" size={24} /> */}
            <NavCloseIcon />
          </ModalTrigger>
        </div>
        <p className="text-text-secondary dark:text-white text-base font-medium text-center">
          New Disbursement
        </p>
      </div>
      <div className="custom-flex-col gap-6 px-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Select
            required
            id="property"
            label="property"
            options={["apartment", "house", "land"]}
          />
          <Select
            required
            id="tenant-occupant"
            label="tenant / occupany"
            options={["tenant 1", "tenant 2"]}
          />
          <Select
            required
            isSearchable={false}
            label="disbursement mode"
            id="disbursement-mode"
            options={[
              "bank transfer",
              "wallet",
              "cash deposit",
              "bank deposit",
              "other mode of payment",
            ]}
          />
          <Input
            required
            placeholder="₦"
            id="amount-disburse"
            style={{ backgroundColor: isDarkMode ? "#020617" : "white" }}
            label="amount disburse"
          />
        </div>
        <div className="custom-flex-col gap-1">
          <Label required id="transaction-description">
            transaction description
          </Label>
          <TextArea id="transaction-description" />
        </div>
        <Button size="sm_medium" className="py-2 px-8" onClick={nextStep}>
          create
        </Button>
      </div>
    </div>
  );
};

export default NewDisbursementForm;
